/******/ (function(modules) { // webpackBootstrap
/******/ 	function hotDisposeChunk(chunkId) {
/******/ 		delete installedChunks[chunkId];
/******/ 	}
/******/ 	var parentHotUpdateCallback = window["webpackHotUpdate"];
/******/ 	window["webpackHotUpdate"] = 
/******/ 	function webpackHotUpdateCallback(chunkId, moreModules) { // eslint-disable-line no-unused-vars
/******/ 		hotAddUpdateChunk(chunkId, moreModules);
/******/ 		if(parentHotUpdateCallback) parentHotUpdateCallback(chunkId, moreModules);
/******/ 	} ;
/******/ 	
/******/ 	function hotDownloadUpdateChunk(chunkId) { // eslint-disable-line no-unused-vars
/******/ 		var head = document.getElementsByTagName("head")[0];
/******/ 		var script = document.createElement("script");
/******/ 		script.type = "text/javascript";
/******/ 		script.charset = "utf-8";
/******/ 		script.src = __webpack_require__.p + "" + chunkId + "." + hotCurrentHash + ".hot-update.js";
/******/ 		;
/******/ 		head.appendChild(script);
/******/ 	}
/******/ 	
/******/ 	function hotDownloadManifest(requestTimeout) { // eslint-disable-line no-unused-vars
/******/ 		requestTimeout = requestTimeout || 10000;
/******/ 		return new Promise(function(resolve, reject) {
/******/ 			if(typeof XMLHttpRequest === "undefined")
/******/ 				return reject(new Error("No browser support"));
/******/ 			try {
/******/ 				var request = new XMLHttpRequest();
/******/ 				var requestPath = __webpack_require__.p + "" + hotCurrentHash + ".hot-update.json";
/******/ 				request.open("GET", requestPath, true);
/******/ 				request.timeout = requestTimeout;
/******/ 				request.send(null);
/******/ 			} catch(err) {
/******/ 				return reject(err);
/******/ 			}
/******/ 			request.onreadystatechange = function() {
/******/ 				if(request.readyState !== 4) return;
/******/ 				if(request.status === 0) {
/******/ 					// timeout
/******/ 					reject(new Error("Manifest request to " + requestPath + " timed out."));
/******/ 				} else if(request.status === 404) {
/******/ 					// no update available
/******/ 					resolve();
/******/ 				} else if(request.status !== 200 && request.status !== 304) {
/******/ 					// other failure
/******/ 					reject(new Error("Manifest request to " + requestPath + " failed."));
/******/ 				} else {
/******/ 					// success
/******/ 					try {
/******/ 						var update = JSON.parse(request.responseText);
/******/ 					} catch(e) {
/******/ 						reject(e);
/******/ 						return;
/******/ 					}
/******/ 					resolve(update);
/******/ 				}
/******/ 			};
/******/ 		});
/******/ 	}
/******/
/******/ 	
/******/ 	
/******/ 	var hotApplyOnUpdate = true;
/******/ 	var hotCurrentHash = "1cea7fc3400fcb2cdf5d"; // eslint-disable-line no-unused-vars
/******/ 	var hotRequestTimeout = 10000;
/******/ 	var hotCurrentModuleData = {};
/******/ 	var hotCurrentChildModule; // eslint-disable-line no-unused-vars
/******/ 	var hotCurrentParents = []; // eslint-disable-line no-unused-vars
/******/ 	var hotCurrentParentsTemp = []; // eslint-disable-line no-unused-vars
/******/ 	
/******/ 	function hotCreateRequire(moduleId) { // eslint-disable-line no-unused-vars
/******/ 		var me = installedModules[moduleId];
/******/ 		if(!me) return __webpack_require__;
/******/ 		var fn = function(request) {
/******/ 			if(me.hot.active) {
/******/ 				if(installedModules[request]) {
/******/ 					if(installedModules[request].parents.indexOf(moduleId) < 0)
/******/ 						installedModules[request].parents.push(moduleId);
/******/ 				} else {
/******/ 					hotCurrentParents = [moduleId];
/******/ 					hotCurrentChildModule = request;
/******/ 				}
/******/ 				if(me.children.indexOf(request) < 0)
/******/ 					me.children.push(request);
/******/ 			} else {
/******/ 				console.warn("[HMR] unexpected require(" + request + ") from disposed module " + moduleId);
/******/ 				hotCurrentParents = [];
/******/ 			}
/******/ 			return __webpack_require__(request);
/******/ 		};
/******/ 		var ObjectFactory = function ObjectFactory(name) {
/******/ 			return {
/******/ 				configurable: true,
/******/ 				enumerable: true,
/******/ 				get: function() {
/******/ 					return __webpack_require__[name];
/******/ 				},
/******/ 				set: function(value) {
/******/ 					__webpack_require__[name] = value;
/******/ 				}
/******/ 			};
/******/ 		};
/******/ 		for(var name in __webpack_require__) {
/******/ 			if(Object.prototype.hasOwnProperty.call(__webpack_require__, name) && name !== "e") {
/******/ 				Object.defineProperty(fn, name, ObjectFactory(name));
/******/ 			}
/******/ 		}
/******/ 		fn.e = function(chunkId) {
/******/ 			if(hotStatus === "ready")
/******/ 				hotSetStatus("prepare");
/******/ 			hotChunksLoading++;
/******/ 			return __webpack_require__.e(chunkId).then(finishChunkLoading, function(err) {
/******/ 				finishChunkLoading();
/******/ 				throw err;
/******/ 			});
/******/ 	
/******/ 			function finishChunkLoading() {
/******/ 				hotChunksLoading--;
/******/ 				if(hotStatus === "prepare") {
/******/ 					if(!hotWaitingFilesMap[chunkId]) {
/******/ 						hotEnsureUpdateChunk(chunkId);
/******/ 					}
/******/ 					if(hotChunksLoading === 0 && hotWaitingFiles === 0) {
/******/ 						hotUpdateDownloaded();
/******/ 					}
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 		return fn;
/******/ 	}
/******/ 	
/******/ 	function hotCreateModule(moduleId) { // eslint-disable-line no-unused-vars
/******/ 		var hot = {
/******/ 			// private stuff
/******/ 			_acceptedDependencies: {},
/******/ 			_declinedDependencies: {},
/******/ 			_selfAccepted: false,
/******/ 			_selfDeclined: false,
/******/ 			_disposeHandlers: [],
/******/ 			_main: hotCurrentChildModule !== moduleId,
/******/ 	
/******/ 			// Module API
/******/ 			active: true,
/******/ 			accept: function(dep, callback) {
/******/ 				if(typeof dep === "undefined")
/******/ 					hot._selfAccepted = true;
/******/ 				else if(typeof dep === "function")
/******/ 					hot._selfAccepted = dep;
/******/ 				else if(typeof dep === "object")
/******/ 					for(var i = 0; i < dep.length; i++)
/******/ 						hot._acceptedDependencies[dep[i]] = callback || function() {};
/******/ 				else
/******/ 					hot._acceptedDependencies[dep] = callback || function() {};
/******/ 			},
/******/ 			decline: function(dep) {
/******/ 				if(typeof dep === "undefined")
/******/ 					hot._selfDeclined = true;
/******/ 				else if(typeof dep === "object")
/******/ 					for(var i = 0; i < dep.length; i++)
/******/ 						hot._declinedDependencies[dep[i]] = true;
/******/ 				else
/******/ 					hot._declinedDependencies[dep] = true;
/******/ 			},
/******/ 			dispose: function(callback) {
/******/ 				hot._disposeHandlers.push(callback);
/******/ 			},
/******/ 			addDisposeHandler: function(callback) {
/******/ 				hot._disposeHandlers.push(callback);
/******/ 			},
/******/ 			removeDisposeHandler: function(callback) {
/******/ 				var idx = hot._disposeHandlers.indexOf(callback);
/******/ 				if(idx >= 0) hot._disposeHandlers.splice(idx, 1);
/******/ 			},
/******/ 	
/******/ 			// Management API
/******/ 			check: hotCheck,
/******/ 			apply: hotApply,
/******/ 			status: function(l) {
/******/ 				if(!l) return hotStatus;
/******/ 				hotStatusHandlers.push(l);
/******/ 			},
/******/ 			addStatusHandler: function(l) {
/******/ 				hotStatusHandlers.push(l);
/******/ 			},
/******/ 			removeStatusHandler: function(l) {
/******/ 				var idx = hotStatusHandlers.indexOf(l);
/******/ 				if(idx >= 0) hotStatusHandlers.splice(idx, 1);
/******/ 			},
/******/ 	
/******/ 			//inherit from previous dispose call
/******/ 			data: hotCurrentModuleData[moduleId]
/******/ 		};
/******/ 		hotCurrentChildModule = undefined;
/******/ 		return hot;
/******/ 	}
/******/ 	
/******/ 	var hotStatusHandlers = [];
/******/ 	var hotStatus = "idle";
/******/ 	
/******/ 	function hotSetStatus(newStatus) {
/******/ 		hotStatus = newStatus;
/******/ 		for(var i = 0; i < hotStatusHandlers.length; i++)
/******/ 			hotStatusHandlers[i].call(null, newStatus);
/******/ 	}
/******/ 	
/******/ 	// while downloading
/******/ 	var hotWaitingFiles = 0;
/******/ 	var hotChunksLoading = 0;
/******/ 	var hotWaitingFilesMap = {};
/******/ 	var hotRequestedFilesMap = {};
/******/ 	var hotAvailableFilesMap = {};
/******/ 	var hotDeferred;
/******/ 	
/******/ 	// The update info
/******/ 	var hotUpdate, hotUpdateNewHash;
/******/ 	
/******/ 	function toModuleId(id) {
/******/ 		var isNumber = (+id) + "" === id;
/******/ 		return isNumber ? +id : id;
/******/ 	}
/******/ 	
/******/ 	function hotCheck(apply) {
/******/ 		if(hotStatus !== "idle") throw new Error("check() is only allowed in idle status");
/******/ 		hotApplyOnUpdate = apply;
/******/ 		hotSetStatus("check");
/******/ 		return hotDownloadManifest(hotRequestTimeout).then(function(update) {
/******/ 			if(!update) {
/******/ 				hotSetStatus("idle");
/******/ 				return null;
/******/ 			}
/******/ 			hotRequestedFilesMap = {};
/******/ 			hotWaitingFilesMap = {};
/******/ 			hotAvailableFilesMap = update.c;
/******/ 			hotUpdateNewHash = update.h;
/******/ 	
/******/ 			hotSetStatus("prepare");
/******/ 			var promise = new Promise(function(resolve, reject) {
/******/ 				hotDeferred = {
/******/ 					resolve: resolve,
/******/ 					reject: reject
/******/ 				};
/******/ 			});
/******/ 			hotUpdate = {};
/******/ 			var chunkId = 1;
/******/ 			{ // eslint-disable-line no-lone-blocks
/******/ 				/*globals chunkId */
/******/ 				hotEnsureUpdateChunk(chunkId);
/******/ 			}
/******/ 			if(hotStatus === "prepare" && hotChunksLoading === 0 && hotWaitingFiles === 0) {
/******/ 				hotUpdateDownloaded();
/******/ 			}
/******/ 			return promise;
/******/ 		});
/******/ 	}
/******/ 	
/******/ 	function hotAddUpdateChunk(chunkId, moreModules) { // eslint-disable-line no-unused-vars
/******/ 		if(!hotAvailableFilesMap[chunkId] || !hotRequestedFilesMap[chunkId])
/******/ 			return;
/******/ 		hotRequestedFilesMap[chunkId] = false;
/******/ 		for(var moduleId in moreModules) {
/******/ 			if(Object.prototype.hasOwnProperty.call(moreModules, moduleId)) {
/******/ 				hotUpdate[moduleId] = moreModules[moduleId];
/******/ 			}
/******/ 		}
/******/ 		if(--hotWaitingFiles === 0 && hotChunksLoading === 0) {
/******/ 			hotUpdateDownloaded();
/******/ 		}
/******/ 	}
/******/ 	
/******/ 	function hotEnsureUpdateChunk(chunkId) {
/******/ 		if(!hotAvailableFilesMap[chunkId]) {
/******/ 			hotWaitingFilesMap[chunkId] = true;
/******/ 		} else {
/******/ 			hotRequestedFilesMap[chunkId] = true;
/******/ 			hotWaitingFiles++;
/******/ 			hotDownloadUpdateChunk(chunkId);
/******/ 		}
/******/ 	}
/******/ 	
/******/ 	function hotUpdateDownloaded() {
/******/ 		hotSetStatus("ready");
/******/ 		var deferred = hotDeferred;
/******/ 		hotDeferred = null;
/******/ 		if(!deferred) return;
/******/ 		if(hotApplyOnUpdate) {
/******/ 			// Wrap deferred object in Promise to mark it as a well-handled Promise to
/******/ 			// avoid triggering uncaught exception warning in Chrome.
/******/ 			// See https://bugs.chromium.org/p/chromium/issues/detail?id=465666
/******/ 			Promise.resolve().then(function() {
/******/ 				return hotApply(hotApplyOnUpdate);
/******/ 			}).then(
/******/ 				function(result) {
/******/ 					deferred.resolve(result);
/******/ 				},
/******/ 				function(err) {
/******/ 					deferred.reject(err);
/******/ 				}
/******/ 			);
/******/ 		} else {
/******/ 			var outdatedModules = [];
/******/ 			for(var id in hotUpdate) {
/******/ 				if(Object.prototype.hasOwnProperty.call(hotUpdate, id)) {
/******/ 					outdatedModules.push(toModuleId(id));
/******/ 				}
/******/ 			}
/******/ 			deferred.resolve(outdatedModules);
/******/ 		}
/******/ 	}
/******/ 	
/******/ 	function hotApply(options) {
/******/ 		if(hotStatus !== "ready") throw new Error("apply() is only allowed in ready status");
/******/ 		options = options || {};
/******/ 	
/******/ 		var cb;
/******/ 		var i;
/******/ 		var j;
/******/ 		var module;
/******/ 		var moduleId;
/******/ 	
/******/ 		function getAffectedStuff(updateModuleId) {
/******/ 			var outdatedModules = [updateModuleId];
/******/ 			var outdatedDependencies = {};
/******/ 	
/******/ 			var queue = outdatedModules.slice().map(function(id) {
/******/ 				return {
/******/ 					chain: [id],
/******/ 					id: id
/******/ 				};
/******/ 			});
/******/ 			while(queue.length > 0) {
/******/ 				var queueItem = queue.pop();
/******/ 				var moduleId = queueItem.id;
/******/ 				var chain = queueItem.chain;
/******/ 				module = installedModules[moduleId];
/******/ 				if(!module || module.hot._selfAccepted)
/******/ 					continue;
/******/ 				if(module.hot._selfDeclined) {
/******/ 					return {
/******/ 						type: "self-declined",
/******/ 						chain: chain,
/******/ 						moduleId: moduleId
/******/ 					};
/******/ 				}
/******/ 				if(module.hot._main) {
/******/ 					return {
/******/ 						type: "unaccepted",
/******/ 						chain: chain,
/******/ 						moduleId: moduleId
/******/ 					};
/******/ 				}
/******/ 				for(var i = 0; i < module.parents.length; i++) {
/******/ 					var parentId = module.parents[i];
/******/ 					var parent = installedModules[parentId];
/******/ 					if(!parent) continue;
/******/ 					if(parent.hot._declinedDependencies[moduleId]) {
/******/ 						return {
/******/ 							type: "declined",
/******/ 							chain: chain.concat([parentId]),
/******/ 							moduleId: moduleId,
/******/ 							parentId: parentId
/******/ 						};
/******/ 					}
/******/ 					if(outdatedModules.indexOf(parentId) >= 0) continue;
/******/ 					if(parent.hot._acceptedDependencies[moduleId]) {
/******/ 						if(!outdatedDependencies[parentId])
/******/ 							outdatedDependencies[parentId] = [];
/******/ 						addAllToSet(outdatedDependencies[parentId], [moduleId]);
/******/ 						continue;
/******/ 					}
/******/ 					delete outdatedDependencies[parentId];
/******/ 					outdatedModules.push(parentId);
/******/ 					queue.push({
/******/ 						chain: chain.concat([parentId]),
/******/ 						id: parentId
/******/ 					});
/******/ 				}
/******/ 			}
/******/ 	
/******/ 			return {
/******/ 				type: "accepted",
/******/ 				moduleId: updateModuleId,
/******/ 				outdatedModules: outdatedModules,
/******/ 				outdatedDependencies: outdatedDependencies
/******/ 			};
/******/ 		}
/******/ 	
/******/ 		function addAllToSet(a, b) {
/******/ 			for(var i = 0; i < b.length; i++) {
/******/ 				var item = b[i];
/******/ 				if(a.indexOf(item) < 0)
/******/ 					a.push(item);
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// at begin all updates modules are outdated
/******/ 		// the "outdated" status can propagate to parents if they don't accept the children
/******/ 		var outdatedDependencies = {};
/******/ 		var outdatedModules = [];
/******/ 		var appliedUpdate = {};
/******/ 	
/******/ 		var warnUnexpectedRequire = function warnUnexpectedRequire() {
/******/ 			console.warn("[HMR] unexpected require(" + result.moduleId + ") to disposed module");
/******/ 		};
/******/ 	
/******/ 		for(var id in hotUpdate) {
/******/ 			if(Object.prototype.hasOwnProperty.call(hotUpdate, id)) {
/******/ 				moduleId = toModuleId(id);
/******/ 				var result;
/******/ 				if(hotUpdate[id]) {
/******/ 					result = getAffectedStuff(moduleId);
/******/ 				} else {
/******/ 					result = {
/******/ 						type: "disposed",
/******/ 						moduleId: id
/******/ 					};
/******/ 				}
/******/ 				var abortError = false;
/******/ 				var doApply = false;
/******/ 				var doDispose = false;
/******/ 				var chainInfo = "";
/******/ 				if(result.chain) {
/******/ 					chainInfo = "\nUpdate propagation: " + result.chain.join(" -> ");
/******/ 				}
/******/ 				switch(result.type) {
/******/ 					case "self-declined":
/******/ 						if(options.onDeclined)
/******/ 							options.onDeclined(result);
/******/ 						if(!options.ignoreDeclined)
/******/ 							abortError = new Error("Aborted because of self decline: " + result.moduleId + chainInfo);
/******/ 						break;
/******/ 					case "declined":
/******/ 						if(options.onDeclined)
/******/ 							options.onDeclined(result);
/******/ 						if(!options.ignoreDeclined)
/******/ 							abortError = new Error("Aborted because of declined dependency: " + result.moduleId + " in " + result.parentId + chainInfo);
/******/ 						break;
/******/ 					case "unaccepted":
/******/ 						if(options.onUnaccepted)
/******/ 							options.onUnaccepted(result);
/******/ 						if(!options.ignoreUnaccepted)
/******/ 							abortError = new Error("Aborted because " + moduleId + " is not accepted" + chainInfo);
/******/ 						break;
/******/ 					case "accepted":
/******/ 						if(options.onAccepted)
/******/ 							options.onAccepted(result);
/******/ 						doApply = true;
/******/ 						break;
/******/ 					case "disposed":
/******/ 						if(options.onDisposed)
/******/ 							options.onDisposed(result);
/******/ 						doDispose = true;
/******/ 						break;
/******/ 					default:
/******/ 						throw new Error("Unexception type " + result.type);
/******/ 				}
/******/ 				if(abortError) {
/******/ 					hotSetStatus("abort");
/******/ 					return Promise.reject(abortError);
/******/ 				}
/******/ 				if(doApply) {
/******/ 					appliedUpdate[moduleId] = hotUpdate[moduleId];
/******/ 					addAllToSet(outdatedModules, result.outdatedModules);
/******/ 					for(moduleId in result.outdatedDependencies) {
/******/ 						if(Object.prototype.hasOwnProperty.call(result.outdatedDependencies, moduleId)) {
/******/ 							if(!outdatedDependencies[moduleId])
/******/ 								outdatedDependencies[moduleId] = [];
/******/ 							addAllToSet(outdatedDependencies[moduleId], result.outdatedDependencies[moduleId]);
/******/ 						}
/******/ 					}
/******/ 				}
/******/ 				if(doDispose) {
/******/ 					addAllToSet(outdatedModules, [result.moduleId]);
/******/ 					appliedUpdate[moduleId] = warnUnexpectedRequire;
/******/ 				}
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// Store self accepted outdated modules to require them later by the module system
/******/ 		var outdatedSelfAcceptedModules = [];
/******/ 		for(i = 0; i < outdatedModules.length; i++) {
/******/ 			moduleId = outdatedModules[i];
/******/ 			if(installedModules[moduleId] && installedModules[moduleId].hot._selfAccepted)
/******/ 				outdatedSelfAcceptedModules.push({
/******/ 					module: moduleId,
/******/ 					errorHandler: installedModules[moduleId].hot._selfAccepted
/******/ 				});
/******/ 		}
/******/ 	
/******/ 		// Now in "dispose" phase
/******/ 		hotSetStatus("dispose");
/******/ 		Object.keys(hotAvailableFilesMap).forEach(function(chunkId) {
/******/ 			if(hotAvailableFilesMap[chunkId] === false) {
/******/ 				hotDisposeChunk(chunkId);
/******/ 			}
/******/ 		});
/******/ 	
/******/ 		var idx;
/******/ 		var queue = outdatedModules.slice();
/******/ 		while(queue.length > 0) {
/******/ 			moduleId = queue.pop();
/******/ 			module = installedModules[moduleId];
/******/ 			if(!module) continue;
/******/ 	
/******/ 			var data = {};
/******/ 	
/******/ 			// Call dispose handlers
/******/ 			var disposeHandlers = module.hot._disposeHandlers;
/******/ 			for(j = 0; j < disposeHandlers.length; j++) {
/******/ 				cb = disposeHandlers[j];
/******/ 				cb(data);
/******/ 			}
/******/ 			hotCurrentModuleData[moduleId] = data;
/******/ 	
/******/ 			// disable module (this disables requires from this module)
/******/ 			module.hot.active = false;
/******/ 	
/******/ 			// remove module from cache
/******/ 			delete installedModules[moduleId];
/******/ 	
/******/ 			// when disposing there is no need to call dispose handler
/******/ 			delete outdatedDependencies[moduleId];
/******/ 	
/******/ 			// remove "parents" references from all children
/******/ 			for(j = 0; j < module.children.length; j++) {
/******/ 				var child = installedModules[module.children[j]];
/******/ 				if(!child) continue;
/******/ 				idx = child.parents.indexOf(moduleId);
/******/ 				if(idx >= 0) {
/******/ 					child.parents.splice(idx, 1);
/******/ 				}
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// remove outdated dependency from module children
/******/ 		var dependency;
/******/ 		var moduleOutdatedDependencies;
/******/ 		for(moduleId in outdatedDependencies) {
/******/ 			if(Object.prototype.hasOwnProperty.call(outdatedDependencies, moduleId)) {
/******/ 				module = installedModules[moduleId];
/******/ 				if(module) {
/******/ 					moduleOutdatedDependencies = outdatedDependencies[moduleId];
/******/ 					for(j = 0; j < moduleOutdatedDependencies.length; j++) {
/******/ 						dependency = moduleOutdatedDependencies[j];
/******/ 						idx = module.children.indexOf(dependency);
/******/ 						if(idx >= 0) module.children.splice(idx, 1);
/******/ 					}
/******/ 				}
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// Not in "apply" phase
/******/ 		hotSetStatus("apply");
/******/ 	
/******/ 		hotCurrentHash = hotUpdateNewHash;
/******/ 	
/******/ 		// insert new code
/******/ 		for(moduleId in appliedUpdate) {
/******/ 			if(Object.prototype.hasOwnProperty.call(appliedUpdate, moduleId)) {
/******/ 				modules[moduleId] = appliedUpdate[moduleId];
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// call accept handlers
/******/ 		var error = null;
/******/ 		for(moduleId in outdatedDependencies) {
/******/ 			if(Object.prototype.hasOwnProperty.call(outdatedDependencies, moduleId)) {
/******/ 				module = installedModules[moduleId];
/******/ 				if(module) {
/******/ 					moduleOutdatedDependencies = outdatedDependencies[moduleId];
/******/ 					var callbacks = [];
/******/ 					for(i = 0; i < moduleOutdatedDependencies.length; i++) {
/******/ 						dependency = moduleOutdatedDependencies[i];
/******/ 						cb = module.hot._acceptedDependencies[dependency];
/******/ 						if(cb) {
/******/ 							if(callbacks.indexOf(cb) >= 0) continue;
/******/ 							callbacks.push(cb);
/******/ 						}
/******/ 					}
/******/ 					for(i = 0; i < callbacks.length; i++) {
/******/ 						cb = callbacks[i];
/******/ 						try {
/******/ 							cb(moduleOutdatedDependencies);
/******/ 						} catch(err) {
/******/ 							if(options.onErrored) {
/******/ 								options.onErrored({
/******/ 									type: "accept-errored",
/******/ 									moduleId: moduleId,
/******/ 									dependencyId: moduleOutdatedDependencies[i],
/******/ 									error: err
/******/ 								});
/******/ 							}
/******/ 							if(!options.ignoreErrored) {
/******/ 								if(!error)
/******/ 									error = err;
/******/ 							}
/******/ 						}
/******/ 					}
/******/ 				}
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// Load self accepted modules
/******/ 		for(i = 0; i < outdatedSelfAcceptedModules.length; i++) {
/******/ 			var item = outdatedSelfAcceptedModules[i];
/******/ 			moduleId = item.module;
/******/ 			hotCurrentParents = [moduleId];
/******/ 			try {
/******/ 				__webpack_require__(moduleId);
/******/ 			} catch(err) {
/******/ 				if(typeof item.errorHandler === "function") {
/******/ 					try {
/******/ 						item.errorHandler(err);
/******/ 					} catch(err2) {
/******/ 						if(options.onErrored) {
/******/ 							options.onErrored({
/******/ 								type: "self-accept-error-handler-errored",
/******/ 								moduleId: moduleId,
/******/ 								error: err2,
/******/ 								orginalError: err, // TODO remove in webpack 4
/******/ 								originalError: err
/******/ 							});
/******/ 						}
/******/ 						if(!options.ignoreErrored) {
/******/ 							if(!error)
/******/ 								error = err2;
/******/ 						}
/******/ 						if(!error)
/******/ 							error = err;
/******/ 					}
/******/ 				} else {
/******/ 					if(options.onErrored) {
/******/ 						options.onErrored({
/******/ 							type: "self-accept-errored",
/******/ 							moduleId: moduleId,
/******/ 							error: err
/******/ 						});
/******/ 					}
/******/ 					if(!options.ignoreErrored) {
/******/ 						if(!error)
/******/ 							error = err;
/******/ 					}
/******/ 				}
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// handle errors in accept handlers and self accepted module load
/******/ 		if(error) {
/******/ 			hotSetStatus("fail");
/******/ 			return Promise.reject(error);
/******/ 		}
/******/ 	
/******/ 		hotSetStatus("idle");
/******/ 		return new Promise(function(resolve) {
/******/ 			resolve(outdatedModules);
/******/ 		});
/******/ 	}
/******/
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {},
/******/ 			hot: hotCreateModule(moduleId),
/******/ 			parents: (hotCurrentParentsTemp = hotCurrentParents, hotCurrentParents = [], hotCurrentParentsTemp),
/******/ 			children: []
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, hotCreateRequire(moduleId));
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// __webpack_hash__
/******/ 	__webpack_require__.h = function() { return hotCurrentHash; };
/******/
/******/ 	// Load entry module and return exports
/******/ 	return hotCreateRequire(36)(__webpack_require__.s = 36);
/******/ })
/************************************************************************/
/******/ ({

/***/ 0:
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(module) {var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;

var _typeof2 = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

!function (root, factory) {
  "object" == ( false ? "undefined" : _typeof2(exports)) && "object" == ( false ? "undefined" : _typeof2(module)) ? module.exports = factory() :  true ? !(__WEBPACK_AMD_DEFINE_ARRAY__ = [], __WEBPACK_AMD_DEFINE_FACTORY__ = (factory),
				__WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ?
				(__WEBPACK_AMD_DEFINE_FACTORY__.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__)) : __WEBPACK_AMD_DEFINE_FACTORY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__)) : "object" == (typeof exports === "undefined" ? "undefined" : _typeof2(exports)) ? exports.alfrid = factory() : root.alfrid = factory();
}("undefined" != typeof self ? self : undefined, function () {
  return function (modules) {
    function __webpack_require__(moduleId) {
      if (installedModules[moduleId]) return installedModules[moduleId].exports;var module = installedModules[moduleId] = { i: moduleId, l: !1, exports: {} };return modules[moduleId].call(module.exports, module, module.exports, __webpack_require__), module.l = !0, module.exports;
    }var installedModules = {};return __webpack_require__.m = modules, __webpack_require__.c = installedModules, __webpack_require__.d = function (exports, name, getter) {
      __webpack_require__.o(exports, name) || Object.defineProperty(exports, name, { configurable: !1, enumerable: !0, get: getter });
    }, __webpack_require__.n = function (module) {
      var getter = module && module.__esModule ? function () {
        return module.default;
      } : function () {
        return module;
      };return __webpack_require__.d(getter, "a", getter), getter;
    }, __webpack_require__.o = function (object, property) {
      return Object.prototype.hasOwnProperty.call(object, property);
    }, __webpack_require__.p = "", __webpack_require__(__webpack_require__.s = 35);
  }([function (module, exports, __webpack_require__) {
    "use strict";
    function _interopRequireDefault(obj) {
      return obj && obj.__esModule ? obj : { default: obj };
    }function _classCallCheck(instance, Constructor) {
      if (!(instance instanceof Constructor)) throw new TypeError("Cannot call a class as a function");
    }Object.defineProperty(exports, "__esModule", { value: !0 });var _createClass = function () {
      function defineProperties(target, props) {
        for (var i = 0; i < props.length; i++) {
          var descriptor = props[i];descriptor.enumerable = descriptor.enumerable || !1, descriptor.configurable = !0, "value" in descriptor && (descriptor.writable = !0), Object.defineProperty(target, descriptor.key, descriptor);
        }
      }return function (Constructor, protoProps, staticProps) {
        return protoProps && defineProperties(Constructor.prototype, protoProps), staticProps && defineProperties(Constructor, staticProps), Constructor;
      };
    }(),
        _glMatrix = __webpack_require__(2),
        _getAndApplyExtension = __webpack_require__(40),
        _getAndApplyExtension2 = _interopRequireDefault(_getAndApplyExtension),
        _exposeAttributes = __webpack_require__(41),
        _exposeAttributes2 = _interopRequireDefault(_exposeAttributes),
        _getFloat = __webpack_require__(43),
        _getFloat2 = _interopRequireDefault(_getFloat),
        _getHalfFloat = __webpack_require__(44),
        _getHalfFloat2 = _interopRequireDefault(_getHalfFloat),
        _getAttribLoc = __webpack_require__(22),
        _ExtensionsList = (_interopRequireDefault(_getAttribLoc), __webpack_require__(45)),
        _ExtensionsList2 = _interopRequireDefault(_ExtensionsList),
        gl = void 0,
        GLTool = function () {
      function GLTool() {
        _classCallCheck(this, GLTool), this._viewport = [0, 0, 0, 0], this._enabledVertexAttribute = [], this.identityMatrix = _glMatrix.mat4.create(), this._normalMatrix = _glMatrix.mat3.create(), this._inverseModelViewMatrix = _glMatrix.mat3.create(), this._modelMatrix = _glMatrix.mat4.create(), this._matrix = _glMatrix.mat4.create(), this._matrixStacks = [], this._lastMesh = null, this._useWebGL2 = !1, this._hasArrayInstance = !1, this._extArrayInstance = !1, this._hasCheckedExt = !1, _glMatrix.mat4.identity(this.identityMatrix, this.identityMatrix), this.isMobile = !1, /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) && (this.isMobile = !0);
      }return _createClass(GLTool, [{ key: "init", value: function value(mCanvas) {
          var mParameters = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : {};if (null === mCanvas || void 0 === mCanvas) return void console.error("Canvas not exist");void 0 !== this.canvas && null !== this.canvas && this.destroy(), this.canvas = mCanvas, this.setSize(window.innerWidth, window.innerHeight), mParameters.useWebgl2 = void 0 !== mParameters.useWebgl2 && mParameters.useWebgl2;var ctx = void 0;mParameters.useWebgl2 ? (ctx = this.canvas.getContext("experimental-webgl2", mParameters) || this.canvas.getContext("webgl2", mParameters), ctx ? (this._useWebGL2 = !0, console.log("Using WebGL 2 : ", ctx)) : (ctx = this.canvas.getContext("webgl", mParameters) || this.canvas.getContext("experimental-webgl", mParameters), this._useWebGL2 = !1)) : (ctx = this.canvas.getContext("webgl", mParameters) || this.canvas.getContext("experimental-webgl", mParameters), this._useWebGL2 = !1), this.initWithGL(ctx);
        } }, { key: "initWithGL", value: function value(ctx) {
          this.canvas || (this.canvas = ctx.canvas), gl = this.gl = ctx, this.extensions = {};for (var i = 0; i < _ExtensionsList2.default.length; i++) {
            this.extensions[_ExtensionsList2.default[i]] = gl.getExtension(_ExtensionsList2.default[i]);
          }(0, _exposeAttributes2.default)(), (0, _getAndApplyExtension2.default)(gl, "OES_vertex_array_object"), (0, _getAndApplyExtension2.default)(gl, "ANGLE_instanced_arrays"), (0, _getAndApplyExtension2.default)(gl, "WEBGL_draw_buffers"), this.webgl2 && gl.getExtension("EXT_color_buffer_float"), this.enable(this.DEPTH_TEST), this.enable(this.CULL_FACE), this.enable(this.BLEND), this.enableAlphaBlending();
        } }, { key: "setViewport", value: function value(x, y, w, h) {
          var hasChanged = !1;x !== this._viewport[0] && (hasChanged = !0), y !== this._viewport[1] && (hasChanged = !0), w !== this._viewport[2] && (hasChanged = !0), h !== this._viewport[3] && (hasChanged = !0), hasChanged && (gl.viewport(x, y, w, h), this._viewport = [x, y, w, h]);
        } }, { key: "scissor", value: function value(x, y, w, h) {
          gl.scissor(x, y, w, h);
        } }, { key: "clear", value: function value(r, g, b, a) {
          gl.clearColor(r, g, b, a), gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
        } }, { key: "cullFace", value: function value(mValue) {
          gl.cullFace(mValue);
        } }, { key: "setMatrices", value: function value(mCamera) {
          this.camera = mCamera, this.rotate(this.identityMatrix);
        } }, { key: "useShader", value: function value(mShader) {
          this.shader = mShader, this.shaderProgram = this.shader.shaderProgram;
        } }, { key: "rotate", value: function value(mRotation) {
          _glMatrix.mat4.copy(this._modelMatrix, mRotation), _glMatrix.mat4.multiply(this._matrix, this.camera.matrix, this._modelMatrix), _glMatrix.mat3.fromMat4(this._normalMatrix, this._matrix), _glMatrix.mat3.invert(this._normalMatrix, this._normalMatrix), _glMatrix.mat3.transpose(this._normalMatrix, this._normalMatrix), _glMatrix.mat3.fromMat4(this._inverseModelViewMatrix, this._matrix), _glMatrix.mat3.invert(this._inverseModelViewMatrix, this._inverseModelViewMatrix);
        } }, { key: "draw", value: function value(mMesh, mDrawingType) {
          if (mMesh.length) for (var i = 0; i < mMesh.length; i++) {
            this.draw(mMesh[i]);
          } else {
            mMesh.bind(this.shaderProgram), void 0 !== this.camera && (this.shader.uniform("uProjectionMatrix", "mat4", this.camera.projection), this.shader.uniform("uViewMatrix", "mat4", this.camera.matrix)), this.shader.uniform("uModelMatrix", "mat4", this._modelMatrix), this.shader.uniform("uNormalMatrix", "mat3", this._normalMatrix), this.shader.uniform("uModelViewMatrixInverse", "mat3", this._inverseModelViewMatrix);var drawType = mMesh.drawType;void 0 !== mDrawingType && (drawType = mDrawingType), mMesh.isInstanced ? gl.drawElementsInstanced(mMesh.drawType, mMesh.iBuffer.numItems, gl.UNSIGNED_SHORT, 0, mMesh.numInstance) : drawType === gl.POINTS ? gl.drawArrays(drawType, 0, mMesh.vertexSize) : gl.drawElements(drawType, mMesh.iBuffer.numItems, gl.UNSIGNED_SHORT, 0), mMesh.unbind();
          }
        } }, { key: "drawTransformFeedback", value: function value(mTransformObject) {
          var meshSource = mTransformObject.meshSource,
              meshDestination = mTransformObject.meshDestination,
              numPoints = mTransformObject.numPoints,
              transformFeedback = mTransformObject.transformFeedback;meshSource.bind(this.shaderProgram), meshDestination.generateBuffers(this.shaderProgram), gl.bindTransformFeedback(gl.TRANSFORM_FEEDBACK, transformFeedback), meshDestination.attributes.forEach(function (attr, i) {
            gl.bindBufferBase(gl.TRANSFORM_FEEDBACK_BUFFER, i, attr.buffer);
          }), gl.enable(gl.RASTERIZER_DISCARD), gl.beginTransformFeedback(gl.POINTS), gl.drawArrays(gl.POINTS, 0, numPoints), gl.endTransformFeedback(), gl.disable(gl.RASTERIZER_DISCARD), gl.useProgram(null), gl.bindBuffer(gl.ARRAY_BUFFER, null), meshDestination.attributes.forEach(function (attr, i) {
            gl.bindBufferBase(gl.TRANSFORM_FEEDBACK_BUFFER, i, null);
          }), gl.bindTransformFeedback(gl.TRANSFORM_FEEDBACK, null), meshSource.unbind();
        } }, { key: "setSize", value: function value(mWidth, mHeight) {
          this._width = mWidth, this._height = mHeight, this.canvas.width = this._width, this.canvas.height = this._height, this._aspectRatio = this._width / this._height, gl && this.viewport(0, 0, this._width, this._height);
        } }, { key: "showExtensions", value: function value() {
          console.log("Extensions : ", this.extensions);for (var ext in this.extensions) {
            this.extensions[ext] && console.log(ext, ":", this.extensions[ext]);
          }
        } }, { key: "checkExtension", value: function value(mExtension) {
          return !!this.extensions[mExtension];
        } }, { key: "getExtension", value: function value(mExtension) {
          return this.extensions[mExtension];
        } }, { key: "enableAlphaBlending", value: function value() {
          gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
        } }, { key: "enableAdditiveBlending", value: function value() {
          gl.blendFunc(gl.ONE, gl.ONE);
        } }, { key: "pushMatrix", value: function value() {
          var mtx = _glMatrix.mat4.clone(this._modelMatrix);this._matrixStacks.push(mtx);
        } }, { key: "popMatrix", value: function value() {
          if (0 === this._matrixStacks.length) return null;var mtx = this._matrixStacks.pop();this.rotate(mtx);
        } }, { key: "enable", value: function value(mParameter) {
          gl.enable(mParameter);
        } }, { key: "disable", value: function value(mParameter) {
          gl.disable(mParameter);
        } }, { key: "viewport", value: function value(x, y, w, h) {
          this.setViewport(x, y, w, h);
        } }, { key: "destroy", value: function value() {
          if (this.canvas.parentNode) try {
            this.canvas.parentNode.removeChild(this.canvas);
          } catch (e) {
            console.log("Error : ", e);
          }this.canvas = null;
        } }, { key: "FLOAT", get: function get() {
          return (0, _getFloat2.default)();
        } }, { key: "HALF_FLOAT", get: function get() {
          return (0, _getHalfFloat2.default)();
        } }, { key: "width", get: function get() {
          return this._width;
        } }, { key: "height", get: function get() {
          return this._height;
        } }, { key: "aspectRatio", get: function get() {
          return this._aspectRatio;
        } }, { key: "webgl2", get: function get() {
          return this._useWebGL2;
        } }]), GLTool;
    }(),
        GL = new GLTool();exports.default = GL;
  }, function (module, exports, __webpack_require__) {
    "use strict";
    function _classCallCheck(instance, Constructor) {
      if (!(instance instanceof Constructor)) throw new TypeError("Cannot call a class as a function");
    }Object.defineProperty(exports, "__esModule", { value: !0 });var _typeof = "function" == typeof Symbol && "symbol" == _typeof2(Symbol.iterator) ? function (obj) {
      return typeof obj === "undefined" ? "undefined" : _typeof2(obj);
    } : function (obj) {
      return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj === "undefined" ? "undefined" : _typeof2(obj);
    },
        _createClass = function () {
      function defineProperties(target, props) {
        for (var i = 0; i < props.length; i++) {
          var descriptor = props[i];descriptor.enumerable = descriptor.enumerable || !1, descriptor.configurable = !0, "value" in descriptor && (descriptor.writable = !0), Object.defineProperty(target, descriptor.key, descriptor);
        }
      }return function (Constructor, protoProps, staticProps) {
        return protoProps && defineProperties(Constructor.prototype, protoProps), staticProps && defineProperties(Constructor, staticProps), Constructor;
      };
    }(),
        _GLTool = __webpack_require__(0),
        _GLTool2 = function (obj) {
      return obj && obj.__esModule ? obj : { default: obj };
    }(_GLTool),
        isSame = (__webpack_require__(46), function (array1, array2) {
      if (array1.length !== array2.length) return !1;for (var i = 0; i < array1.length; i++) {
        if (array1[i] !== array2[i]) return !1;
      }return !0;
    }),
        addLineNumbers = function addLineNumbers(string) {
      for (var lines = string.split("\n"), i = 0; i < lines.length; i++) {
        lines[i] = i + 1 + ": " + lines[i];
      }return lines.join("\n");
    },
        cloneArray = function cloneArray(mArray) {
      return mArray.slice ? mArray.slice(0) : new Float32Array(mArray);
    },
        gl = void 0,
        defaultVertexShader = __webpack_require__(9),
        defaultFragmentShader = __webpack_require__(47),
        uniformMapping = { float: "uniform1f", vec2: "uniform2fv", vec3: "uniform3fv", vec4: "uniform4fv", int: "uniform1i", mat3: "uniformMatrix3fv", mat4: "uniformMatrix4fv" },
        GLShader = function () {
      function GLShader() {
        var strVertexShader = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : defaultVertexShader,
            strFragmentShader = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : defaultFragmentShader,
            mVaryings = arguments[2];_classCallCheck(this, GLShader), gl = _GLTool2.default.gl, this.parameters = [], this.uniformTextures = [], this._varyings = mVaryings, strVertexShader || (strVertexShader = defaultVertexShader), strFragmentShader || (strFragmentShader = defaultVertexShader);var vsShader = this._createShaderProgram(strVertexShader, !0),
            fsShader = this._createShaderProgram(strFragmentShader, !1);this._attachShaderProgram(vsShader, fsShader);
      }return _createClass(GLShader, [{ key: "bind", value: function value() {
          _GLTool2.default.shader !== this && (gl.useProgram(this.shaderProgram), _GLTool2.default.useShader(this), this.uniformTextures = []);
        } }, { key: "uniform", value: function value(mName, mType, mValue) {
          if ("object" === (void 0 === mName ? "undefined" : _typeof(mName))) return void this.uniformObject(mName);for (var uniformType = uniformMapping[mType] || mType, hasUniform = !1, oUniform = void 0, parameterIndex = -1, i = 0; i < this.parameters.length; i++) {
            if (oUniform = this.parameters[i], oUniform.name === mName) {
              hasUniform = !0, parameterIndex = i;break;
            }
          }var isNumber = !1;if (hasUniform ? (this.shaderProgram[mName] = oUniform.uniformLoc, isNumber = oUniform.isNumber) : (isNumber = "uniform1i" === uniformType || "uniform1f" === uniformType, this.shaderProgram[mName] = gl.getUniformLocation(this.shaderProgram, mName), isNumber ? this.parameters.push({ name: mName, type: uniformType, value: mValue, uniformLoc: this.shaderProgram[mName], isNumber: isNumber }) : this.parameters.push({ name: mName, type: uniformType, value: cloneArray(mValue), uniformLoc: this.shaderProgram[mName], isNumber: isNumber }), parameterIndex = this.parameters.length - 1), this.parameters[parameterIndex].uniformLoc) if (-1 === uniformType.indexOf("Matrix")) {
            if (isNumber) {
              var needUpdate = this.parameters[parameterIndex].value !== mValue || !hasUniform;needUpdate && (gl[uniformType](this.shaderProgram[mName], mValue), this.parameters[parameterIndex].value = mValue);
            } else isSame(this.parameters[parameterIndex].value, mValue) && hasUniform || (gl[uniformType](this.shaderProgram[mName], mValue), this.parameters[parameterIndex].value = cloneArray(mValue));
          } else isSame(this.parameters[parameterIndex].value, mValue) && hasUniform || (gl[uniformType](this.shaderProgram[mName], !1, mValue), this.parameters[parameterIndex].value = cloneArray(mValue));
        } }, { key: "uniformObject", value: function value(mUniformObj) {
          for (var uniformName in mUniformObj) {
            var uniformValue = mUniformObj[uniformName],
                uniformType = GLShader.getUniformType(uniformValue);if (uniformValue.concat && uniformValue[0].concat) {
              for (var tmp = [], i = 0; i < uniformValue.length; i++) {
                tmp = tmp.concat(uniformValue[i]);
              }uniformValue = tmp;
            }this.uniform(uniformName, uniformType, uniformValue);
          }
        } }, { key: "_createShaderProgram", value: function value(mShaderStr, isVertexShader) {
          var shaderType = isVertexShader ? _GLTool2.default.VERTEX_SHADER : _GLTool2.default.FRAGMENT_SHADER,
              shader = gl.createShader(shaderType);return gl.shaderSource(shader, mShaderStr), gl.compileShader(shader), gl.getShaderParameter(shader, gl.COMPILE_STATUS) ? shader : (console.warn("Error in Shader : ", gl.getShaderInfoLog(shader)), console.log(addLineNumbers(mShaderStr)), null);
        } }, { key: "_attachShaderProgram", value: function value(mVertexShader, mFragmentShader) {
          this.shaderProgram = gl.createProgram(), gl.attachShader(this.shaderProgram, mVertexShader), gl.attachShader(this.shaderProgram, mFragmentShader), gl.deleteShader(mVertexShader), gl.deleteShader(mFragmentShader), this._varyings && (console.log("Transform feedback setup : ", this._varyings), gl.transformFeedbackVaryings(this.shaderProgram, this._varyings, gl.SEPARATE_ATTRIBS)), gl.linkProgram(this.shaderProgram);
        } }]), GLShader;
    }();GLShader.getUniformType = function (mValue) {
      var isArray = !!mValue.concat,
          getArrayUniformType = function getArrayUniformType(mValue) {
        return 9 === mValue.length ? "uniformMatrix3fv" : 16 === mValue.length ? "uniformMatrix4fv" : "vec" + mValue.length;
      };return isArray ? getArrayUniformType(mValue[0].concat ? mValue[0] : mValue) : "float";
    }, exports.default = GLShader;
  }, function (module, exports, __webpack_require__) {
    "use strict";
    function _interopRequireWildcard(obj) {
      if (obj && obj.__esModule) return obj;var newObj = {};if (null != obj) for (var key in obj) {
        Object.prototype.hasOwnProperty.call(obj, key) && (newObj[key] = obj[key]);
      }return newObj.default = obj, newObj;
    }Object.defineProperty(exports, "__esModule", { value: !0 }), exports.vec4 = exports.vec3 = exports.vec2 = exports.quat2 = exports.quat = exports.mat4 = exports.mat3 = exports.mat2d = exports.mat2 = exports.glMatrix = void 0;var _common = __webpack_require__(3),
        glMatrix = _interopRequireWildcard(_common),
        _mat = __webpack_require__(36),
        mat2 = _interopRequireWildcard(_mat),
        _mat2d = __webpack_require__(37),
        mat2d = _interopRequireWildcard(_mat2d),
        _mat2 = __webpack_require__(17),
        mat3 = _interopRequireWildcard(_mat2),
        _mat3 = __webpack_require__(18),
        mat4 = _interopRequireWildcard(_mat3),
        _quat = __webpack_require__(19),
        quat = _interopRequireWildcard(_quat),
        _quat2 = __webpack_require__(38),
        quat2 = _interopRequireWildcard(_quat2),
        _vec = __webpack_require__(39),
        vec2 = _interopRequireWildcard(_vec),
        _vec2 = __webpack_require__(20),
        vec3 = _interopRequireWildcard(_vec2),
        _vec3 = __webpack_require__(21),
        vec4 = _interopRequireWildcard(_vec3);exports.glMatrix = glMatrix, exports.mat2 = mat2, exports.mat2d = mat2d, exports.mat3 = mat3, exports.mat4 = mat4, exports.quat = quat, exports.quat2 = quat2, exports.vec2 = vec2, exports.vec3 = vec3, exports.vec4 = vec4;
  }, function (module, exports, __webpack_require__) {
    "use strict";
    function setMatrixArrayType(type) {
      exports.ARRAY_TYPE = ARRAY_TYPE = type;
    }function toRadian(a) {
      return a * degree;
    }function equals(a, b) {
      return Math.abs(a - b) <= EPSILON * Math.max(1, Math.abs(a), Math.abs(b));
    }Object.defineProperty(exports, "__esModule", { value: !0 }), exports.setMatrixArrayType = setMatrixArrayType, exports.toRadian = toRadian, exports.equals = equals;var EPSILON = exports.EPSILON = 1e-6,
        ARRAY_TYPE = exports.ARRAY_TYPE = "undefined" != typeof Float32Array ? Float32Array : Array,
        degree = (exports.RANDOM = Math.random, Math.PI / 180);
  }, function (module, exports, __webpack_require__) {
    "use strict";
    function _classCallCheck(instance, Constructor) {
      if (!(instance instanceof Constructor)) throw new TypeError("Cannot call a class as a function");
    }Object.defineProperty(exports, "__esModule", { value: !0 });var _createClass = function () {
      function defineProperties(target, props) {
        for (var i = 0; i < props.length; i++) {
          var descriptor = props[i];descriptor.enumerable = descriptor.enumerable || !1, descriptor.configurable = !0, "value" in descriptor && (descriptor.writable = !0), Object.defineProperty(target, descriptor.key, descriptor);
        }
      }return function (Constructor, protoProps, staticProps) {
        return protoProps && defineProperties(Constructor.prototype, protoProps), staticProps && defineProperties(Constructor, staticProps), Constructor;
      };
    }(),
        Scheduler = function () {
      function Scheduler() {
        _classCallCheck(this, Scheduler), this._delayTasks = [], this._nextTasks = [], this._deferTasks = [], this._highTasks = [], this._usurpTask = [], this._enterframeTasks = [], this._idTable = 0, this._startTime = new Date().getTime(), this._deltaTime = 0, this._internalTime = 0, this._isPaused = !1, this._loop();
      }return _createClass(Scheduler, [{ key: "addEF", value: function value(func, params) {
          params = params || [];var id = this._idTable;return this._enterframeTasks[id] = { func: func, params: params }, this._idTable++, id;
        } }, { key: "removeEF", value: function value(id) {
          return void 0 !== this._enterframeTasks[id] && (this._enterframeTasks[id] = null), -1;
        } }, { key: "delay", value: function value(func, params, _delay) {
          var time = new Date().getTime(),
              t = { func: func, params: params, delay: _delay, time: time };this._delayTasks.push(t);
        } }, { key: "defer", value: function value(func, params) {
          var t = { func: func, params: params };this._deferTasks.push(t);
        } }, { key: "next", value: function value(func, params) {
          var t = { func: func, params: params };this._nextTasks.push(t);
        } }, { key: "usurp", value: function value(func, params) {
          var t = { func: func, params: params };this._usurpTask.push(t);
        } }, { key: "pause", value: function value() {
          this._isPaused = !0;
        } }, { key: "advance", value: function value() {
          this._internalTime += 1 / 60;
        } }, { key: "resume", value: function value() {
          this._isPaused = !1;
        } }, { key: "_process", value: function value() {
          var i = 0,
              task = void 0,
              interval = void 0;for (i = 0; i < this._enterframeTasks.length; i++) {
            null !== (task = this._enterframeTasks[i]) && void 0 !== task && task.func(task.params);
          }for (; this._highTasks.length > 0;) {
            task = this._highTasks.pop(), task.func(task.params);
          }var startTime = new Date().getTime(),
              _startTime = this._deltaTime;for (this._deltaTime = (startTime - this._startTime) / 1e3, i = 0; i < this._delayTasks.length; i++) {
            task = this._delayTasks[i], startTime - task.time > task.delay && (task.func(task.params), this._delayTasks.splice(i, 1));
          }for (startTime = new Date().getTime(), this._deltaTime = (startTime - this._startTime) / 1e3, interval = 1e3 / 60; this._deferTasks.length > 0;) {
            if (task = this._deferTasks.shift(), !(new Date().getTime() - startTime < interval)) {
              this._deferTasks.unshift(task);break;
            }task.func(task.params);
          }for (startTime = new Date().getTime(), this._deltaTime = (startTime - this._startTime) / 1e3, interval = 1e3 / 60; this._usurpTask.length > 0;) {
            task = this._usurpTask.shift(), new Date().getTime() - startTime < interval && task.func(task.params);
          }this._highTasks = this._highTasks.concat(this._nextTasks), this._nextTasks = [], this._usurpTask = [], this._isPaused || (this._internalTime += this._deltaTime - _startTime);
        } }, { key: "_loop", value: function value() {
          var _this = this;this._process(), window.requestAnimationFrame(function () {
            return _this._loop();
          });
        } }, { key: "intervalTime", get: function get() {
          return this._internalTime;
        } }, { key: "deltaTime", get: function get() {
          return this._deltaTime;
        } }]), Scheduler;
    }(),
        scheduler = new Scheduler();exports.default = scheduler;
  }, function (module, exports, __webpack_require__) {
    "use strict";
    function _interopRequireDefault(obj) {
      return obj && obj.__esModule ? obj : { default: obj };
    }function _classCallCheck(instance, Constructor) {
      if (!(instance instanceof Constructor)) throw new TypeError("Cannot call a class as a function");
    }Object.defineProperty(exports, "__esModule", { value: !0 });var _createClass = function () {
      function defineProperties(target, props) {
        for (var i = 0; i < props.length; i++) {
          var descriptor = props[i];descriptor.enumerable = descriptor.enumerable || !1, descriptor.configurable = !0, "value" in descriptor && (descriptor.writable = !0), Object.defineProperty(target, descriptor.key, descriptor);
        }
      }return function (Constructor, protoProps, staticProps) {
        return protoProps && defineProperties(Constructor.prototype, protoProps), staticProps && defineProperties(Constructor, staticProps), Constructor;
      };
    }(),
        _GLTool = __webpack_require__(0),
        _GLTool2 = _interopRequireDefault(_GLTool),
        _glMatrix = __webpack_require__(2),
        _getAttribLoc = __webpack_require__(22),
        _getAttribLoc2 = _interopRequireDefault(_getAttribLoc),
        gl = void 0,
        getBuffer = function getBuffer(attr) {
      var buffer = void 0;return void 0 !== attr.buffer ? buffer = attr.buffer : (buffer = gl.createBuffer(), attr.buffer = buffer), buffer;
    },
        formBuffer = function formBuffer(mData, mNum) {
      for (var ary = [], i = 0; i < mData.length; i += mNum) {
        for (var o = [], j = 0; j < mNum; j++) {
          o.push(mData[i + j]);
        }ary.push(o);
      }return ary;
    },
        Mesh = function () {
      function Mesh() {
        var mDrawingType = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : 4,
            mUseVao = !(arguments.length > 1 && void 0 !== arguments[1]) || arguments[1];_classCallCheck(this, Mesh), gl = _GLTool2.default.gl, this.drawType = mDrawingType, this._attributes = [], this._numInstance = -1, this._enabledVertexAttribute = [], this._indices = [], this._faces = [], this._bufferChanged = [], this._hasIndexBufferChanged = !1, this._hasVAO = !1, this._isInstanced = !1, this._extVAO = !!_GLTool2.default.gl.createVertexArray, this._useVAO = !!this._extVAO && mUseVao;
      }return _createClass(Mesh, [{ key: "bufferVertex", value: function value(mArrayVertices) {
          var mDrawType = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : 35044;return this.bufferData(mArrayVertices, "aVertexPosition", 3, mDrawType), this.normals.length < this.vertices.length && this.bufferNormal(mArrayVertices, mDrawType), this;
        } }, { key: "bufferTexCoord", value: function value(mArrayTexCoords) {
          var mDrawType = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : 35044;return this.bufferData(mArrayTexCoords, "aTextureCoord", 2, mDrawType), this;
        } }, { key: "bufferNormal", value: function value(mNormals) {
          var mDrawType = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : 35044;return this.bufferData(mNormals, "aNormal", 3, mDrawType), this;
        } }, { key: "bufferIndex", value: function value(mArrayIndices) {
          var isDynamic = arguments.length > 1 && void 0 !== arguments[1] && arguments[1];return this._drawType = isDynamic ? gl.DYNAMIC_DRAW : gl.STATIC_DRAW, this._indices = new Uint16Array(mArrayIndices), this._numItems = this._indices.length, this;
        } }, { key: "bufferFlattenData", value: function value(mData, mName, mItemSize) {
          var data = (arguments.length > 3 && void 0 !== arguments[3] && arguments[3], arguments.length > 4 && void 0 !== arguments[4] && arguments[4], formBuffer(mData, mItemSize));return this.bufferData(data, mName, mItemSize, 35044, !1), this;
        } }, { key: "bufferData", value: function value(mData, mName, mItemSize) {
          var mDrawType = arguments.length > 3 && void 0 !== arguments[3] ? arguments[3] : 35044,
              isInstanced = arguments.length > 4 && void 0 !== arguments[4] && arguments[4],
              i = 0,
              drawType = mDrawType,
              bufferData = [];for (mItemSize || (mItemSize = mData[0].length), this._isInstanced = isInstanced || this._isInstanced, i = 0; i < mData.length; i++) {
            for (var j = 0; j < mData[i].length; j++) {
              bufferData.push(mData[i][j]);
            }
          }var dataArray = new Float32Array(bufferData),
              attribute = this.getAttribute(mName);return attribute ? (attribute.itemSize = mItemSize, attribute.dataArray = dataArray, attribute.source = mData) : this._attributes.push({ name: mName, source: mData, itemSize: mItemSize, drawType: drawType, dataArray: dataArray, isInstanced: isInstanced }), this._bufferChanged.push(mName), this;
        } }, { key: "bufferInstance", value: function value(mData, mName) {
          if (!_GLTool2.default.gl.vertexAttribDivisor) return void console.error("Extension : ANGLE_instanced_arrays is not supported with this device !");var itemSize = mData[0].length;this._numInstance = mData.length, this.bufferData(mData, mName, itemSize, 35044, !0);
        } }, { key: "bind", value: function value(mShaderProgram) {
          this.generateBuffers(mShaderProgram), this.hasVAO ? gl.bindVertexArray(this.vao) : (this.attributes.forEach(function (attribute) {
            gl.bindBuffer(gl.ARRAY_BUFFER, attribute.buffer);var attrPosition = attribute.attrPosition;gl.vertexAttribPointer(attrPosition, attribute.itemSize, gl.FLOAT, !1, 0, 0), attribute.isInstanced && gl.vertexAttribDivisor(attrPosition, 1);
          }), gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.iBuffer));
        } }, { key: "generateBuffers", value: function value(mShaderProgram) {
          var _this = this;0 != this._bufferChanged.length && (this._useVAO ? (this._vao || (this._vao = gl.createVertexArray()), gl.bindVertexArray(this._vao), this._attributes.forEach(function (attrObj) {
            if (-1 !== _this._bufferChanged.indexOf(attrObj.name)) {
              var buffer = getBuffer(attrObj);gl.bindBuffer(gl.ARRAY_BUFFER, buffer), gl.bufferData(gl.ARRAY_BUFFER, attrObj.dataArray, attrObj.drawType);var attrPosition = (0, _getAttribLoc2.default)(gl, mShaderProgram, attrObj.name);gl.enableVertexAttribArray(attrPosition), gl.vertexAttribPointer(attrPosition, attrObj.itemSize, gl.FLOAT, !1, 0, 0), attrObj.attrPosition = attrPosition, attrObj.isInstanced && gl.vertexAttribDivisor(attrPosition, 1);
            }
          }), this._updateIndexBuffer(), gl.bindVertexArray(null), this._hasVAO = !0) : (this._attributes.forEach(function (attrObj) {
            if (-1 !== _this._bufferChanged.indexOf(attrObj.name)) {
              var buffer = getBuffer(attrObj);gl.bindBuffer(gl.ARRAY_BUFFER, buffer), gl.bufferData(gl.ARRAY_BUFFER, attrObj.dataArray, attrObj.drawType);var attrPosition = (0, _getAttribLoc2.default)(gl, mShaderProgram, attrObj.name);gl.enableVertexAttribArray(attrPosition), gl.vertexAttribPointer(attrPosition, attrObj.itemSize, gl.FLOAT, !1, 0, 0), attrObj.attrPosition = attrPosition, attrObj.isInstanced && gl.vertexAttribDivisor(attrPosition, 1);
            }
          }), this._updateIndexBuffer()), this._hasIndexBufferChanged = !1, this._bufferChanged = []);
        } }, { key: "unbind", value: function value() {
          this._useVAO && gl.bindVertexArray(null), this._attributes.forEach(function (attribute) {
            attribute.isInstanced && gl.vertexAttribDivisor(attribute.attrPosition, 0);
          });
        } }, { key: "_updateIndexBuffer", value: function value() {
          this._hasIndexBufferChanged || (this.iBuffer || (this.iBuffer = gl.createBuffer()), gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.iBuffer), gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, this._indices, this._drawType), this.iBuffer.itemSize = 1, this.iBuffer.numItems = this._numItems);
        } }, { key: "computeNormals", value: function value() {
          var usingFaceNormals = arguments.length > 0 && void 0 !== arguments[0] && arguments[0];this.generateFaces(), usingFaceNormals ? this._computeFaceNormals() : this._computeVertexNormals();
        } }, { key: "_computeFaceNormals", value: function value() {
          for (var faceIndex = void 0, face = void 0, normals = [], i = 0; i < this._indices.length; i += 3) {
            faceIndex = i / 3, face = this._faces[faceIndex];var N = face.normal;normals[face.indices[0]] = N, normals[face.indices[1]] = N, normals[face.indices[2]] = N;
          }this.bufferNormal(normals);
        } }, { key: "_computeVertexNormals", value: function value() {
          for (var face = void 0, sumNormal = _glMatrix.vec3.create(), normals = [], vertices = this.vertices, i = 0; i < vertices.length; i++) {
            _glMatrix.vec3.set(sumNormal, 0, 0, 0);for (var j = 0; j < this._faces.length; j++) {
              face = this._faces[j], face.indices.indexOf(i) >= 0 && (sumNormal[0] += face.normal[0], sumNormal[1] += face.normal[1], sumNormal[2] += face.normal[2]);
            }_glMatrix.vec3.normalize(sumNormal, sumNormal), normals.push([sumNormal[0], sumNormal[1], sumNormal[2]]);
          }this.bufferNormal(normals);
        } }, { key: "generateFaces", value: function value() {
          for (var ia = void 0, ib = void 0, ic = void 0, a = void 0, b = void 0, c = void 0, vertices = (_glMatrix.vec3.create(), _glMatrix.vec3.create(), _glMatrix.vec3.create(), this.vertices), i = 0; i < this._indices.length; i += 3) {
            ia = this._indices[i], ib = this._indices[i + 1], ic = this._indices[i + 2], a = vertices[ia], b = vertices[ib], c = vertices[ic];var face = { indices: [ia, ib, ic], vertices: [a, b, c] };this._faces.push(face);
          }
        } }, { key: "getAttribute", value: function value(mName) {
          return this._attributes.find(function (a) {
            return a.name === mName;
          });
        } }, { key: "getSource", value: function value(mName) {
          var attr = this.getAttribute(mName);return attr ? attr.source : [];
        } }, { key: "vertices", get: function get() {
          return this.getSource("aVertexPosition");
        } }, { key: "normals", get: function get() {
          return this.getSource("aNormal");
        } }, { key: "coords", get: function get() {
          return this.getSource("aTextureCoord");
        } }, { key: "indices", get: function get() {
          return this._indices;
        } }, { key: "vertexSize", get: function get() {
          return this.vertices.length;
        } }, { key: "faces", get: function get() {
          return this._faces;
        } }, { key: "attributes", get: function get() {
          return this._attributes;
        } }, { key: "hasVAO", get: function get() {
          return this._hasVAO;
        } }, { key: "vao", get: function get() {
          return this._vao;
        } }, { key: "numInstance", get: function get() {
          return this._numInstance;
        } }, { key: "isInstanced", get: function get() {
          return this._isInstanced;
        } }]), Mesh;
    }();exports.default = Mesh;
  }, function (module, exports, __webpack_require__) {
    "use strict";
    function _classCallCheck(instance, Constructor) {
      if (!(instance instanceof Constructor)) throw new TypeError("Cannot call a class as a function");
    }Object.defineProperty(exports, "__esModule", { value: !0 });var _createClass = function () {
      function defineProperties(target, props) {
        for (var i = 0; i < props.length; i++) {
          var descriptor = props[i];descriptor.enumerable = descriptor.enumerable || !1, descriptor.configurable = !0, "value" in descriptor && (descriptor.writable = !0), Object.defineProperty(target, descriptor.key, descriptor);
        }
      }return function (Constructor, protoProps, staticProps) {
        return protoProps && defineProperties(Constructor.prototype, protoProps), staticProps && defineProperties(Constructor, staticProps), Constructor;
      };
    }(),
        _GLTool = __webpack_require__(0),
        _GLTool2 = function (obj) {
      return obj && obj.__esModule ? obj : { default: obj };
    }(_GLTool),
        Batch = function () {
      function Batch(mMesh, mShader) {
        _classCallCheck(this, Batch), this._mesh = mMesh, this._shader = mShader;
      }return _createClass(Batch, [{ key: "draw", value: function value() {
          this._shader.bind(), _GLTool2.default.draw(this.mesh);
        } }, { key: "mesh", get: function get() {
          return this._mesh;
        } }, { key: "shader", get: function get() {
          return this._shader;
        } }]), Batch;
    }();exports.default = Batch;
  }, function (module, exports, __webpack_require__) {
    "use strict";
    module.exports = { 0: "NONE", 1: "ONE", 2: "LINE_LOOP", 3: "LINE_STRIP", 4: "TRIANGLES", 5: "TRIANGLE_STRIP", 6: "TRIANGLE_FAN", 256: "DEPTH_BUFFER_BIT", 512: "NEVER", 513: "LESS", 514: "EQUAL", 515: "LEQUAL", 516: "GREATER", 517: "NOTEQUAL", 518: "GEQUAL", 519: "ALWAYS", 768: "SRC_COLOR", 769: "ONE_MINUS_SRC_COLOR", 770: "SRC_ALPHA", 771: "ONE_MINUS_SRC_ALPHA", 772: "DST_ALPHA", 773: "ONE_MINUS_DST_ALPHA", 774: "DST_COLOR", 775: "ONE_MINUS_DST_COLOR", 776: "SRC_ALPHA_SATURATE", 1024: "STENCIL_BUFFER_BIT", 1028: "FRONT", 1029: "BACK", 1032: "FRONT_AND_BACK", 1280: "INVALID_ENUM", 1281: "INVALID_VALUE", 1282: "INVALID_OPERATION", 1285: "OUT_OF_MEMORY", 1286: "INVALID_FRAMEBUFFER_OPERATION", 2304: "CW", 2305: "CCW", 2849: "LINE_WIDTH", 2884: "CULL_FACE", 2885: "CULL_FACE_MODE", 2886: "FRONT_FACE", 2928: "DEPTH_RANGE", 2929: "DEPTH_TEST", 2930: "DEPTH_WRITEMASK", 2931: "DEPTH_CLEAR_VALUE", 2932: "DEPTH_FUNC", 2960: "STENCIL_TEST", 2961: "STENCIL_CLEAR_VALUE", 2962: "STENCIL_FUNC", 2963: "STENCIL_VALUE_MASK", 2964: "STENCIL_FAIL", 2965: "STENCIL_PASS_DEPTH_FAIL", 2966: "STENCIL_PASS_DEPTH_PASS", 2967: "STENCIL_REF", 2968: "STENCIL_WRITEMASK", 2978: "VIEWPORT", 3024: "DITHER", 3042: "BLEND", 3088: "SCISSOR_BOX", 3089: "SCISSOR_TEST", 3106: "COLOR_CLEAR_VALUE", 3107: "COLOR_WRITEMASK", 3317: "UNPACK_ALIGNMENT", 3333: "PACK_ALIGNMENT", 3379: "MAX_TEXTURE_SIZE", 3386: "MAX_VIEWPORT_DIMS", 3408: "SUBPIXEL_BITS", 3410: "RED_BITS", 3411: "GREEN_BITS", 3412: "BLUE_BITS", 3413: "ALPHA_BITS", 3414: "DEPTH_BITS", 3415: "STENCIL_BITS", 3553: "TEXTURE_2D", 4352: "DONT_CARE", 4353: "FASTEST", 4354: "NICEST", 5120: "BYTE", 5121: "UNSIGNED_BYTE", 5122: "SHORT", 5123: "UNSIGNED_SHORT", 5124: "INT", 5125: "UNSIGNED_INT", 5126: "FLOAT", 5386: "INVERT", 5890: "TEXTURE", 6401: "STENCIL_INDEX", 6402: "DEPTH_COMPONENT", 6403: "RED", 6406: "ALPHA", 6407: "RGB", 6408: "RGBA", 6409: "LUMINANCE", 6410: "LUMINANCE_ALPHA", 7680: "KEEP", 7681: "REPLACE", 7682: "INCR", 7683: "DECR", 7936: "VENDOR", 7937: "RENDERER", 7938: "VERSION", 9728: "NEAREST", 9729: "LINEAR", 9984: "NEAREST_MIPMAP_NEAREST", 9985: "LINEAR_MIPMAP_NEAREST", 9986: "NEAREST_MIPMAP_LINEAR", 9987: "LINEAR_MIPMAP_LINEAR", 10240: "TEXTURE_MAG_FILTER", 10241: "TEXTURE_MIN_FILTER", 10242: "TEXTURE_WRAP_S", 10243: "TEXTURE_WRAP_T", 10497: "REPEAT", 10752: "POLYGON_OFFSET_UNITS", 16384: "COLOR_BUFFER_BIT", 32769: "CONSTANT_COLOR", 32770: "ONE_MINUS_CONSTANT_COLOR", 32771: "CONSTANT_ALPHA", 32772: "ONE_MINUS_CONSTANT_ALPHA", 32773: "BLEND_COLOR", 32774: "FUNC_ADD", 32777: "BLEND_EQUATION_RGB", 32778: "FUNC_SUBTRACT", 32779: "FUNC_REVERSE_SUBTRACT", 32819: "UNSIGNED_SHORT_4_4_4_4", 32820: "UNSIGNED_SHORT_5_5_5_1", 32823: "POLYGON_OFFSET_FILL", 32824: "POLYGON_OFFSET_FACTOR", 32854: "RGBA4", 32855: "RGB5_A1", 32873: "TEXTURE_BINDING_2D", 32926: "SAMPLE_ALPHA_TO_COVERAGE", 32928: "SAMPLE_COVERAGE", 32936: "SAMPLE_BUFFERS", 32937: "SAMPLES", 32938: "SAMPLE_COVERAGE_VALUE", 32939: "SAMPLE_COVERAGE_INVERT", 32968: "BLEND_DST_RGB", 32969: "BLEND_SRC_RGB", 32970: "BLEND_DST_ALPHA", 32971: "BLEND_SRC_ALPHA", 33071: "CLAMP_TO_EDGE", 33170: "GENERATE_MIPMAP_HINT", 33189: "DEPTH_COMPONENT16", 33306: "DEPTH_STENCIL_ATTACHMENT", 33321: "R8", 33635: "UNSIGNED_SHORT_5_6_5", 33648: "MIRRORED_REPEAT", 33901: "ALIASED_POINT_SIZE_RANGE", 33902: "ALIASED_LINE_WIDTH_RANGE", 33984: "TEXTURE0", 33985: "TEXTURE1", 33986: "TEXTURE2", 33987: "TEXTURE3", 33988: "TEXTURE4", 33989: "TEXTURE5", 33990: "TEXTURE6", 33991: "TEXTURE7", 33992: "TEXTURE8", 33993: "TEXTURE9", 33994: "TEXTURE10", 33995: "TEXTURE11", 33996: "TEXTURE12", 33997: "TEXTURE13", 33998: "TEXTURE14", 33999: "TEXTURE15", 34e3: "TEXTURE16", 34001: "TEXTURE17", 34002: "TEXTURE18", 34003: "TEXTURE19", 34004: "TEXTURE20", 34005: "TEXTURE21", 34006: "TEXTURE22", 34007: "TEXTURE23", 34008: "TEXTURE24", 34009: "TEXTURE25", 34010: "TEXTURE26", 34011: "TEXTURE27", 34012: "TEXTURE28", 34013: "TEXTURE29", 34014: "TEXTURE30", 34015: "TEXTURE31", 34016: "ACTIVE_TEXTURE", 34024: "MAX_RENDERBUFFER_SIZE", 34041: "DEPTH_STENCIL", 34055: "INCR_WRAP", 34056: "DECR_WRAP", 34067: "TEXTURE_CUBE_MAP", 34068: "TEXTURE_BINDING_CUBE_MAP", 34069: "TEXTURE_CUBE_MAP_POSITIVE_X", 34070: "TEXTURE_CUBE_MAP_NEGATIVE_X", 34071: "TEXTURE_CUBE_MAP_POSITIVE_Y", 34072: "TEXTURE_CUBE_MAP_NEGATIVE_Y", 34073: "TEXTURE_CUBE_MAP_POSITIVE_Z", 34074: "TEXTURE_CUBE_MAP_NEGATIVE_Z", 34076: "MAX_CUBE_MAP_TEXTURE_SIZE", 34338: "VERTEX_ATTRIB_ARRAY_ENABLED", 34339: "VERTEX_ATTRIB_ARRAY_SIZE", 34340: "VERTEX_ATTRIB_ARRAY_STRIDE", 34341: "VERTEX_ATTRIB_ARRAY_TYPE", 34342: "CURRENT_VERTEX_ATTRIB", 34373: "VERTEX_ATTRIB_ARRAY_POINTER", 34466: "NUM_COMPRESSED_TEXTURE_FORMATS", 34467: "COMPRESSED_TEXTURE_FORMATS", 34660: "BUFFER_SIZE", 34661: "BUFFER_USAGE", 34816: "STENCIL_BACK_FUNC", 34817: "STENCIL_BACK_FAIL", 34818: "STENCIL_BACK_PASS_DEPTH_FAIL", 34819: "STENCIL_BACK_PASS_DEPTH_PASS", 34877: "BLEND_EQUATION_ALPHA", 34921: "MAX_VERTEX_ATTRIBS", 34922: "VERTEX_ATTRIB_ARRAY_NORMALIZED", 34930: "MAX_TEXTURE_IMAGE_UNITS", 34962: "ARRAY_BUFFER", 34963: "ELEMENT_ARRAY_BUFFER", 34964: "ARRAY_BUFFER_BINDING", 34965: "ELEMENT_ARRAY_BUFFER_BINDING", 34975: "VERTEX_ATTRIB_ARRAY_BUFFER_BINDING", 35040: "STREAM_DRAW", 35044: "STATIC_DRAW", 35048: "DYNAMIC_DRAW", 35632: "FRAGMENT_SHADER", 35633: "VERTEX_SHADER", 35660: "MAX_VERTEX_TEXTURE_IMAGE_UNITS", 35661: "MAX_COMBINED_TEXTURE_IMAGE_UNITS", 35663: "SHADER_TYPE", 35664: "FLOAT_VEC2", 35665: "FLOAT_VEC3", 35666: "FLOAT_VEC4", 35667: "INT_VEC2", 35668: "INT_VEC3", 35669: "INT_VEC4", 35670: "BOOL", 35671: "BOOL_VEC2", 35672: "BOOL_VEC3", 35673: "BOOL_VEC4", 35674: "FLOAT_MAT2", 35675: "FLOAT_MAT3", 35676: "FLOAT_MAT4", 35678: "SAMPLER_2D", 35680: "SAMPLER_CUBE", 35712: "DELETE_STATUS", 35713: "COMPILE_STATUS", 35714: "LINK_STATUS", 35715: "VALIDATE_STATUS", 35716: "INFO_LOG_LENGTH", 35717: "ATTACHED_SHADERS", 35718: "ACTIVE_UNIFORMS", 35719: "ACTIVE_UNIFORM_MAX_LENGTH", 35720: "SHADER_SOURCE_LENGTH", 35721: "ACTIVE_ATTRIBUTES", 35722: "ACTIVE_ATTRIBUTE_MAX_LENGTH", 35724: "SHADING_LANGUAGE_VERSION", 35725: "CURRENT_PROGRAM", 36003: "STENCIL_BACK_REF", 36004: "STENCIL_BACK_VALUE_MASK", 36005: "STENCIL_BACK_WRITEMASK", 36006: "FRAMEBUFFER_BINDING", 36007: "RENDERBUFFER_BINDING", 36048: "FRAMEBUFFER_ATTACHMENT_OBJECT_TYPE", 36049: "FRAMEBUFFER_ATTACHMENT_OBJECT_NAME", 36050: "FRAMEBUFFER_ATTACHMENT_TEXTURE_LEVEL", 36051: "FRAMEBUFFER_ATTACHMENT_TEXTURE_CUBE_MAP_FACE", 36053: "FRAMEBUFFER_COMPLETE", 36054: "FRAMEBUFFER_INCOMPLETE_ATTACHMENT", 36055: "FRAMEBUFFER_INCOMPLETE_MISSING_ATTACHMENT", 36057: "FRAMEBUFFER_INCOMPLETE_DIMENSIONS", 36061: "FRAMEBUFFER_UNSUPPORTED", 36064: "COLOR_ATTACHMENT0", 36096: "DEPTH_ATTACHMENT", 36128: "STENCIL_ATTACHMENT", 36160: "FRAMEBUFFER", 36161: "RENDERBUFFER", 36162: "RENDERBUFFER_WIDTH", 36163: "RENDERBUFFER_HEIGHT", 36164: "RENDERBUFFER_INTERNAL_FORMAT", 36168: "STENCIL_INDEX8", 36176: "RENDERBUFFER_RED_SIZE", 36177: "RENDERBUFFER_GREEN_SIZE", 36178: "RENDERBUFFER_BLUE_SIZE", 36179: "RENDERBUFFER_ALPHA_SIZE", 36180: "RENDERBUFFER_DEPTH_SIZE", 36181: "RENDERBUFFER_STENCIL_SIZE", 36194: "RGB565", 36336: "LOW_FLOAT", 36337: "MEDIUM_FLOAT", 36338: "HIGH_FLOAT", 36339: "LOW_INT", 36340: "MEDIUM_INT", 36341: "HIGH_INT", 36346: "SHADER_COMPILER", 36347: "MAX_VERTEX_UNIFORM_VECTORS", 36348: "MAX_VARYING_VECTORS", 36349: "MAX_FRAGMENT_UNIFORM_VECTORS", 37440: "UNPACK_FLIP_Y_WEBGL", 37441: "UNPACK_PREMULTIPLY_ALPHA_WEBGL", 37442: "CONTEXT_LOST_WEBGL", 37443: "UNPACK_COLORSPACE_CONVERSION_WEBGL", 37444: "BROWSER_DEFAULT_WEBGL" };
  }, function (module, exports, __webpack_require__) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: !0 });var _Mesh = __webpack_require__(5),
        _Mesh2 = function (obj) {
      return obj && obj.__esModule ? obj : { default: obj };
    }(_Mesh),
        Geom = {},
        meshTri = void 0;Geom.plane = function (width, height, numSegments) {
      for (var axis = arguments.length > 3 && void 0 !== arguments[3] ? arguments[3] : "xy", drawType = arguments.length > 4 && void 0 !== arguments[4] ? arguments[4] : 4, positions = [], coords = [], indices = [], normals = [], gapX = width / numSegments, gapY = height / numSegments, gapUV = 1 / numSegments, sx = .5 * -width, sy = .5 * -height, index = 0, i = 0; i < numSegments; i++) {
        for (var j = 0; j < numSegments; j++) {
          var tx = gapX * i + sx,
              ty = gapY * j + sy,
              u = i / numSegments,
              v = j / numSegments;"xz" === axis ? (positions.push([tx, 0, ty + gapY]), positions.push([tx + gapX, 0, ty + gapY]), positions.push([tx + gapX, 0, ty]), positions.push([tx, 0, ty]), coords.push([u, 1 - (v + gapUV)]), coords.push([u + gapUV, 1 - (v + gapUV)]), coords.push([u + gapUV, 1 - v]), coords.push([u, 1 - v]), normals.push([0, 1, 0]), normals.push([0, 1, 0]), normals.push([0, 1, 0]), normals.push([0, 1, 0])) : "yz" === axis ? (positions.push([0, ty, tx]), positions.push([0, ty, tx + gapX]), positions.push([0, ty + gapY, tx + gapX]), positions.push([0, ty + gapY, tx]), coords.push([u, v]), coords.push([u + gapUV, v]), coords.push([u + gapUV, v + gapUV]), coords.push([u, v + gapUV]), normals.push([1, 0, 0]), normals.push([1, 0, 0]), normals.push([1, 0, 0]), normals.push([1, 0, 0])) : (positions.push([tx, ty, 0]), positions.push([tx + gapX, ty, 0]), positions.push([tx + gapX, ty + gapY, 0]), positions.push([tx, ty + gapY, 0]), coords.push([u, v]), coords.push([u + gapUV, v]), coords.push([u + gapUV, v + gapUV]), coords.push([u, v + gapUV]), normals.push([0, 0, 1]), normals.push([0, 0, 1]), normals.push([0, 0, 1]), normals.push([0, 0, 1])), indices.push(4 * index + 0), indices.push(4 * index + 1), indices.push(4 * index + 2), indices.push(4 * index + 0), indices.push(4 * index + 2), indices.push(4 * index + 3), index++;
        }
      }var mesh = new _Mesh2.default(drawType);return mesh.bufferVertex(positions), mesh.bufferTexCoord(coords), mesh.bufferIndex(indices), mesh.bufferNormal(normals), mesh;
    }, Geom.sphere = function (size, numSegments) {
      function getPosition(i, j) {
        var isNormal = arguments.length > 2 && void 0 !== arguments[2] && arguments[2],
            rx = i / numSegments * Math.PI - .5 * Math.PI,
            ry = j / numSegments * Math.PI * 2,
            r = isNormal ? 1 : size,
            pos = [];pos[1] = Math.sin(rx) * r;var t = Math.cos(rx) * r;pos[0] = Math.cos(ry) * t, pos[2] = Math.sin(ry) * t;return pos[0] = Math.floor(1e4 * pos[0]) / 1e4, pos[1] = Math.floor(1e4 * pos[1]) / 1e4, pos[2] = Math.floor(1e4 * pos[2]) / 1e4, pos;
      }for (var isInvert = arguments.length > 2 && void 0 !== arguments[2] && arguments[2], drawType = arguments.length > 3 && void 0 !== arguments[3] ? arguments[3] : 4, positions = [], coords = [], indices = [], normals = [], gapUV = 1 / numSegments, index = 0, i = 0; i < numSegments; i++) {
        for (var j = 0; j < numSegments; j++) {
          positions.push(getPosition(i, j)), positions.push(getPosition(i + 1, j)), positions.push(getPosition(i + 1, j + 1)), positions.push(getPosition(i, j + 1)), normals.push(getPosition(i, j, !0)), normals.push(getPosition(i + 1, j, !0)), normals.push(getPosition(i + 1, j + 1, !0)), normals.push(getPosition(i, j + 1, !0));var u = j / numSegments,
              v = i / numSegments;coords.push([1 - u, v]), coords.push([1 - u, v + gapUV]), coords.push([1 - u - gapUV, v + gapUV]), coords.push([1 - u - gapUV, v]), indices.push(4 * index + 0), indices.push(4 * index + 1), indices.push(4 * index + 2), indices.push(4 * index + 0), indices.push(4 * index + 2), indices.push(4 * index + 3), index++;
        }
      }isInvert && indices.reverse();var mesh = new _Mesh2.default(drawType);return mesh.bufferVertex(positions), mesh.bufferTexCoord(coords), mesh.bufferIndex(indices), mesh.bufferNormal(normals), mesh;
    }, Geom.cube = function (w, h, d) {
      var drawType = arguments.length > 3 && void 0 !== arguments[3] ? arguments[3] : 4;h = h || w, d = d || w;var x = w / 2,
          y = h / 2,
          z = d / 2,
          positions = [],
          coords = [],
          indices = [],
          normals = [],
          count = 0;positions.push([-x, y, -z]), positions.push([x, y, -z]), positions.push([x, -y, -z]), positions.push([-x, -y, -z]), normals.push([0, 0, -1]), normals.push([0, 0, -1]), normals.push([0, 0, -1]), normals.push([0, 0, -1]), coords.push([0, 0]), coords.push([1, 0]), coords.push([1, 1]), coords.push([0, 1]), indices.push(4 * count + 0), indices.push(4 * count + 1), indices.push(4 * count + 2), indices.push(4 * count + 0), indices.push(4 * count + 2), indices.push(4 * count + 3), count++, positions.push([x, y, -z]), positions.push([x, y, z]), positions.push([x, -y, z]), positions.push([x, -y, -z]), normals.push([1, 0, 0]), normals.push([1, 0, 0]), normals.push([1, 0, 0]), normals.push([1, 0, 0]), coords.push([0, 0]), coords.push([1, 0]), coords.push([1, 1]), coords.push([0, 1]), indices.push(4 * count + 0), indices.push(4 * count + 1), indices.push(4 * count + 2), indices.push(4 * count + 0), indices.push(4 * count + 2), indices.push(4 * count + 3), count++, positions.push([x, y, z]), positions.push([-x, y, z]), positions.push([-x, -y, z]), positions.push([x, -y, z]), normals.push([0, 0, 1]), normals.push([0, 0, 1]), normals.push([0, 0, 1]), normals.push([0, 0, 1]), coords.push([0, 0]), coords.push([1, 0]), coords.push([1, 1]), coords.push([0, 1]), indices.push(4 * count + 0), indices.push(4 * count + 1), indices.push(4 * count + 2), indices.push(4 * count + 0), indices.push(4 * count + 2), indices.push(4 * count + 3), count++, positions.push([-x, y, z]), positions.push([-x, y, -z]), positions.push([-x, -y, -z]), positions.push([-x, -y, z]), normals.push([-1, 0, 0]), normals.push([-1, 0, 0]), normals.push([-1, 0, 0]), normals.push([-1, 0, 0]), coords.push([0, 0]), coords.push([1, 0]), coords.push([1, 1]), coords.push([0, 1]), indices.push(4 * count + 0), indices.push(4 * count + 1), indices.push(4 * count + 2), indices.push(4 * count + 0), indices.push(4 * count + 2), indices.push(4 * count + 3), count++, positions.push([x, y, -z]), positions.push([-x, y, -z]), positions.push([-x, y, z]), positions.push([x, y, z]), normals.push([0, 1, 0]), normals.push([0, 1, 0]), normals.push([0, 1, 0]), normals.push([0, 1, 0]), coords.push([0, 0]), coords.push([1, 0]), coords.push([1, 1]), coords.push([0, 1]), indices.push(4 * count + 0), indices.push(4 * count + 1), indices.push(4 * count + 2), indices.push(4 * count + 0), indices.push(4 * count + 2), indices.push(4 * count + 3), count++, positions.push([x, -y, z]), positions.push([-x, -y, z]), positions.push([-x, -y, -z]), positions.push([x, -y, -z]), normals.push([0, -1, 0]), normals.push([0, -1, 0]), normals.push([0, -1, 0]), normals.push([0, -1, 0]), coords.push([0, 0]), coords.push([1, 0]), coords.push([1, 1]), coords.push([0, 1]), indices.push(4 * count + 0), indices.push(4 * count + 1), indices.push(4 * count + 2), indices.push(4 * count + 0), indices.push(4 * count + 2), indices.push(4 * count + 3), count++;var mesh = new _Mesh2.default(drawType);return mesh.bufferVertex(positions), mesh.bufferTexCoord(coords), mesh.bufferIndex(indices), mesh.bufferNormal(normals), mesh;
    }, Geom.skybox = function (size) {
      var drawType = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : 4,
          positions = [],
          coords = [],
          indices = [],
          normals = [],
          count = 0;positions.push([size, size, -size]), positions.push([-size, size, -size]), positions.push([-size, -size, -size]), positions.push([size, -size, -size]), normals.push([0, 0, -1]), normals.push([0, 0, -1]), normals.push([0, 0, -1]), normals.push([0, 0, -1]), coords.push([0, 0]), coords.push([1, 0]), coords.push([1, 1]), coords.push([0, 1]), indices.push(4 * count + 0), indices.push(4 * count + 1), indices.push(4 * count + 2), indices.push(4 * count + 0), indices.push(4 * count + 2), indices.push(4 * count + 3), count++, positions.push([size, -size, -size]), positions.push([size, -size, size]), positions.push([size, size, size]), positions.push([size, size, -size]), normals.push([1, 0, 0]), normals.push([1, 0, 0]), normals.push([1, 0, 0]), normals.push([1, 0, 0]), coords.push([0, 0]), coords.push([1, 0]), coords.push([1, 1]), coords.push([0, 1]), indices.push(4 * count + 0), indices.push(4 * count + 1), indices.push(4 * count + 2), indices.push(4 * count + 0), indices.push(4 * count + 2), indices.push(4 * count + 3), count++, positions.push([-size, size, size]), positions.push([size, size, size]), positions.push([size, -size, size]), positions.push([-size, -size, size]), normals.push([0, 0, 1]), normals.push([0, 0, 1]), normals.push([0, 0, 1]), normals.push([0, 0, 1]), coords.push([0, 0]), coords.push([1, 0]), coords.push([1, 1]), coords.push([0, 1]), indices.push(4 * count + 0), indices.push(4 * count + 1), indices.push(4 * count + 2), indices.push(4 * count + 0), indices.push(4 * count + 2), indices.push(4 * count + 3), count++, positions.push([-size, -size, size]), positions.push([-size, -size, -size]), positions.push([-size, size, -size]), positions.push([-size, size, size]), normals.push([-1, 0, 0]), normals.push([-1, 0, 0]), normals.push([-1, 0, 0]), normals.push([-1, 0, 0]), coords.push([0, 0]), coords.push([1, 0]), coords.push([1, 1]), coords.push([0, 1]), indices.push(4 * count + 0), indices.push(4 * count + 1), indices.push(4 * count + 2), indices.push(4 * count + 0), indices.push(4 * count + 2), indices.push(4 * count + 3), count++, positions.push([size, size, size]), positions.push([-size, size, size]), positions.push([-size, size, -size]), positions.push([size, size, -size]), normals.push([0, 1, 0]), normals.push([0, 1, 0]), normals.push([0, 1, 0]), normals.push([0, 1, 0]), coords.push([0, 0]), coords.push([1, 0]), coords.push([1, 1]), coords.push([0, 1]), indices.push(4 * count + 0), indices.push(4 * count + 1), indices.push(4 * count + 2), indices.push(4 * count + 0), indices.push(4 * count + 2), indices.push(4 * count + 3), count++, positions.push([size, -size, -size]), positions.push([-size, -size, -size]), positions.push([-size, -size, size]), positions.push([size, -size, size]), normals.push([0, -1, 0]), normals.push([0, -1, 0]), normals.push([0, -1, 0]), normals.push([0, -1, 0]), coords.push([0, 0]), coords.push([1, 0]), coords.push([1, 1]), coords.push([0, 1]), indices.push(4 * count + 0), indices.push(4 * count + 1), indices.push(4 * count + 2), indices.push(4 * count + 0), indices.push(4 * count + 2), indices.push(4 * count + 3);var mesh = new _Mesh2.default(drawType);return mesh.bufferVertex(positions), mesh.bufferTexCoord(coords), mesh.bufferIndex(indices), mesh.bufferNormal(normals), mesh;
    }, Geom.bigTriangle = function () {
      if (!meshTri) {
        var indices = [2, 1, 0],
            positions = [[-1, -1], [-1, 4], [4, -1]];meshTri = new _Mesh2.default(), meshTri.bufferData(positions, "aPosition", 2), meshTri.bufferIndex(indices);
      }return meshTri;
    }, exports.default = Geom;
  }, function (module, exports) {
    module.exports = "// basic.vert\n\n#define SHADER_NAME BASIC_VERTEX\n\nprecision highp float;\n#define GLSLIFY 1\nattribute vec3 aVertexPosition;\nattribute vec2 aTextureCoord;\nattribute vec3 aNormal;\n\nuniform mat4 uModelMatrix;\nuniform mat4 uViewMatrix;\nuniform mat4 uProjectionMatrix;\n\nvarying vec2 vTextureCoord;\nvarying vec3 vNormal;\n\nvoid main(void) {\n    gl_Position = uProjectionMatrix * uViewMatrix * uModelMatrix * vec4(aVertexPosition, 1.0);\n    vTextureCoord = aTextureCoord;\n    vNormal = aNormal;\n}";
  }, function (module, exports, __webpack_require__) {
    "use strict";
    function _classCallCheck(instance, Constructor) {
      if (!(instance instanceof Constructor)) throw new TypeError("Cannot call a class as a function");
    }Object.defineProperty(exports, "__esModule", { value: !0 });var _createClass = function () {
      function defineProperties(target, props) {
        for (var i = 0; i < props.length; i++) {
          var descriptor = props[i];descriptor.enumerable = descriptor.enumerable || !1, descriptor.configurable = !0, "value" in descriptor && (descriptor.writable = !0), Object.defineProperty(target, descriptor.key, descriptor);
        }
      }return function (Constructor, protoProps, staticProps) {
        return protoProps && defineProperties(Constructor.prototype, protoProps), staticProps && defineProperties(Constructor, staticProps), Constructor;
      };
    }(),
        _scheduling = __webpack_require__(4),
        _scheduling2 = function (obj) {
      return obj && obj.__esModule ? obj : { default: obj };
    }(_scheduling),
        EaseNumber = function () {
      function EaseNumber(mValue) {
        var _this = this,
            mEasing = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : .1;_classCallCheck(this, EaseNumber), this.easing = mEasing, this._value = mValue, this._targetValue = mValue, this._efIndex = _scheduling2.default.addEF(function () {
          return _this._update();
        });
      }return _createClass(EaseNumber, [{ key: "_update", value: function value() {
          this._checkLimit(), this._value += (this._targetValue - this._value) * this.easing, Math.abs(this._targetValue - this._value) < 1e-4 && (this._value = this._targetValue);
        } }, { key: "setTo", value: function value(mValue) {
          this._targetValue = this._value = mValue;
        } }, { key: "add", value: function value(mAdd) {
          this._targetValue += mAdd;
        } }, { key: "limit", value: function value(mMin, mMax) {
          if (mMin > mMax) return void this.limit(mMax, mMin);this._min = mMin, this._max = mMax, this._checkLimit();
        } }, { key: "_checkLimit", value: function value() {
          void 0 !== this._min && this._targetValue < this._min && (this._targetValue = this._min), void 0 !== this._max && this._targetValue > this._max && (this._targetValue = this._max);
        } }, { key: "destroy", value: function value() {
          _scheduling2.default.removeEF(this._efIndex);
        } }, { key: "value", set: function set(mValue) {
          this._targetValue = mValue;
        }, get: function get() {
          return this._value;
        } }, { key: "targetValue", get: function get() {
          return this._targetValue;
        } }]), EaseNumber;
    }();exports.default = EaseNumber;
  }, function (module, exports, __webpack_require__) {
    "use strict";
    function _classCallCheck(instance, Constructor) {
      if (!(instance instanceof Constructor)) throw new TypeError("Cannot call a class as a function");
    }Object.defineProperty(exports, "__esModule", { value: !0 });var _createClass = function () {
      function defineProperties(target, props) {
        for (var i = 0; i < props.length; i++) {
          var descriptor = props[i];descriptor.enumerable = descriptor.enumerable || !1, descriptor.configurable = !0, "value" in descriptor && (descriptor.writable = !0), Object.defineProperty(target, descriptor.key, descriptor);
        }
      }return function (Constructor, protoProps, staticProps) {
        return protoProps && defineProperties(Constructor.prototype, protoProps), staticProps && defineProperties(Constructor, staticProps), Constructor;
      };
    }(),
        _glMatrix = __webpack_require__(2),
        a = _glMatrix.vec3.create(),
        b = _glMatrix.vec3.create(),
        c = _glMatrix.vec3.create(),
        target = _glMatrix.vec3.create(),
        edge1 = _glMatrix.vec3.create(),
        edge2 = _glMatrix.vec3.create(),
        normal = _glMatrix.vec3.create(),
        diff = _glMatrix.vec3.create(),
        Ray = function () {
      function Ray(mOrigin, mDirection) {
        _classCallCheck(this, Ray), this.origin = _glMatrix.vec3.clone(mOrigin), this.direction = _glMatrix.vec3.clone(mDirection);
      }return _createClass(Ray, [{ key: "at", value: function value(t) {
          return _glMatrix.vec3.copy(target, this.direction), _glMatrix.vec3.scale(target, target, t), _glMatrix.vec3.add(target, target, this.origin), target;
        } }, { key: "lookAt", value: function value(mTarget) {
          _glMatrix.vec3.sub(this.direction, mTarget, this.origin), _glMatrix.vec3.normalize(this.origin, this.origin);
        } }, { key: "closestPointToPoint", value: function value(mPoint) {
          var result = _glMatrix.vec3.create();_glMatrix.vec3.sub(mPoint, this.origin);var directionDistance = _glMatrix.vec3.dot(result, this.direction);return directionDistance < 0 ? _glMatrix.vec3.clone(this.origin) : (_glMatrix.vec3.copy(result, this.direction), _glMatrix.vec3.scale(result, result, directionDistance), _glMatrix.vec3.add(result, result, this.origin), result);
        } }, { key: "distanceToPoint", value: function value(mPoint) {
          return Math.sqrt(this.distanceSqToPoint(mPoint));
        } }, { key: "distanceSqToPoint", value: function value(mPoint) {
          var v1 = _glMatrix.vec3.create();_glMatrix.vec3.sub(v1, mPoint, this.origin);var directionDistance = _glMatrix.vec3.dot(v1, this.direction);return directionDistance < 0 ? _glMatrix.vec3.squaredDistance(this.origin, mPoint) : (_glMatrix.vec3.copy(v1, this.direction), _glMatrix.vec3.scale(v1, v1, directionDistance), _glMatrix.vec3.add(v1, v1, this.origin), _glMatrix.vec3.squaredDistance(v1, mPoint));
        } }, { key: "intersectsSphere", value: function value(mCenter, mRadius) {
          return this.distanceToPoint(mCenter) <= mRadius;
        } }, { key: "intersectSphere", value: function value(mCenter, mRadius) {
          var v1 = _glMatrix.vec3.create();_glMatrix.vec3.sub(v1, mCenter, this.origin);var tca = _glMatrix.vec3.dot(v1, this.direction),
              d2 = _glMatrix.vec3.dot(v1, v1) - tca * tca,
              radius2 = mRadius * mRadius;if (d2 > radius2) return null;var thc = Math.sqrt(radius2 - d2),
              t0 = tca - thc,
              t1 = tca + thc;return t0 < 0 && t1 < 0 ? null : t0 < 0 ? this.at(t1) : this.at(t0);
        } }, { key: "distanceToPlane", value: function value(mPlaneCenter, mNormal) {
          _glMatrix.vec3.dot(mNormal, this.direction);
        } }, { key: "intersectTriangle", value: function value(mPA, mPB, mPC) {
          var backfaceCulling = !(arguments.length > 3 && void 0 !== arguments[3]) || arguments[3];_glMatrix.vec3.copy(a, mPA), _glMatrix.vec3.copy(b, mPB), _glMatrix.vec3.copy(c, mPC), _glMatrix.vec3.sub(edge1, b, a), _glMatrix.vec3.sub(edge2, c, a), _glMatrix.vec3.cross(normal, edge1, edge2);var DdN = _glMatrix.vec3.dot(this.direction, normal),
              sign = void 0;if (DdN > 0) {
            if (backfaceCulling) return null;sign = 1;
          } else {
            if (!(DdN < 0)) return null;sign = -1, DdN = -DdN;
          }_glMatrix.vec3.sub(diff, this.origin, a), _glMatrix.vec3.cross(edge2, diff, edge2);var DdQxE2 = sign * _glMatrix.vec3.dot(this.direction, edge2);if (DdQxE2 < 0) return null;_glMatrix.vec3.cross(edge1, edge1, diff);var DdE1xQ = sign * _glMatrix.vec3.dot(this.direction, edge1);if (DdE1xQ < 0) return null;if (DdQxE2 + DdE1xQ > DdN) return null;var Qdn = -sign * _glMatrix.vec3.dot(diff, normal);return Qdn < 0 ? null : this.at(Qdn / DdN);
        } }]), Ray;
    }();exports.default = Ray;
  }, function (module, exports, __webpack_require__) {
    "use strict";
    function _classCallCheck(instance, Constructor) {
      if (!(instance instanceof Constructor)) throw new TypeError("Cannot call a class as a function");
    }Object.defineProperty(exports, "__esModule", { value: !0 });var _createClass = function () {
      function defineProperties(target, props) {
        for (var i = 0; i < props.length; i++) {
          var descriptor = props[i];descriptor.enumerable = descriptor.enumerable || !1, descriptor.configurable = !0, "value" in descriptor && (descriptor.writable = !0), Object.defineProperty(target, descriptor.key, descriptor);
        }
      }return function (Constructor, protoProps, staticProps) {
        return protoProps && defineProperties(Constructor.prototype, protoProps), staticProps && defineProperties(Constructor, staticProps), Constructor;
      };
    }(),
        _glMatrix = __webpack_require__(2),
        Camera = function () {
      function Camera() {
        _classCallCheck(this, Camera), this._matrix = _glMatrix.mat4.create(), this._quat = _glMatrix.quat.create(), this._orientation = _glMatrix.mat4.create(), this._projection = _glMatrix.mat4.create(), this.position = vec3.create();
      }return _createClass(Camera, [{ key: "lookAt", value: function value(aEye, aCenter) {
          var aUp = arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : [0, 1, 0];this._eye = vec3.clone(aEye), this._center = vec3.clone(aCenter), vec3.copy(this.position, aEye), _glMatrix.mat4.identity(this._matrix), _glMatrix.mat4.lookAt(this._matrix, aEye, aCenter, aUp);
        } }, { key: "setFromOrientation", value: function value(x, y, z, w) {
          _glMatrix.quat.set(this._quat, x, y, z, w), _glMatrix.mat4.fromQuat(this._orientation, this._quat), _glMatrix.mat4.translate(this._matrix, this._orientation, this.positionOffset);
        } }, { key: "setProjection", value: function value(mProj) {
          this._projection = _glMatrix.mat4.clone(mProj);
        } }, { key: "setView", value: function value(mView) {
          this._matrix = _glMatrix.mat4.clone(mView);
        } }, { key: "setFromViewProj", value: function value(mView, mProj) {
          this.setView(mView), this.setProjection(mProj);
        } }, { key: "matrix", get: function get() {
          return this._matrix;
        } }, { key: "viewMatrix", get: function get() {
          return this._matrix;
        } }, { key: "projection", get: function get() {
          return this._projection;
        } }, { key: "projectionMatrix", get: function get() {
          return this._projection;
        } }, { key: "eye", get: function get() {
          return this._eye;
        } }, { key: "center", get: function get() {
          return this._center;
        } }]), Camera;
    }();exports.default = Camera;
  }, function (module, exports, __webpack_require__) {
    "use strict";
    function _interopRequireDefault(obj) {
      return obj && obj.__esModule ? obj : { default: obj };
    }function _classCallCheck(instance, Constructor) {
      if (!(instance instanceof Constructor)) throw new TypeError("Cannot call a class as a function");
    }function _possibleConstructorReturn(self, call) {
      if (!self) throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return !call || "object" != (typeof call === "undefined" ? "undefined" : _typeof2(call)) && "function" != typeof call ? self : call;
    }function _inherits(subClass, superClass) {
      if ("function" != typeof superClass && null !== superClass) throw new TypeError("Super expression must either be null or a function, not " + (typeof superClass === "undefined" ? "undefined" : _typeof2(superClass)));subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: !1, writable: !0, configurable: !0 } }), superClass && (Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass);
    }Object.defineProperty(exports, "__esModule", { value: !0 });var _createClass = function () {
      function defineProperties(target, props) {
        for (var i = 0; i < props.length; i++) {
          var descriptor = props[i];descriptor.enumerable = descriptor.enumerable || !1, descriptor.configurable = !0, "value" in descriptor && (descriptor.writable = !0), Object.defineProperty(target, descriptor.key, descriptor);
        }
      }return function (Constructor, protoProps, staticProps) {
        return protoProps && defineProperties(Constructor.prototype, protoProps), staticProps && defineProperties(Constructor, staticProps), Constructor;
      };
    }(),
        _Camera2 = __webpack_require__(12),
        _Camera3 = _interopRequireDefault(_Camera2),
        _Ray = __webpack_require__(11),
        _Ray2 = _interopRequireDefault(_Ray),
        _glMatrix = __webpack_require__(2),
        mInverseViewProj = _glMatrix.mat4.create(),
        cameraDir = _glMatrix.vec3.create(),
        CameraPerspective = function (_Camera) {
      function CameraPerspective(mFov, mAspectRatio, mNear, mFar) {
        _classCallCheck(this, CameraPerspective);var _this = _possibleConstructorReturn(this, (CameraPerspective.__proto__ || Object.getPrototypeOf(CameraPerspective)).call(this));return mFov && _this.setPerspective(mFov, mAspectRatio, mNear, mFar), _this;
      }return _inherits(CameraPerspective, _Camera), _createClass(CameraPerspective, [{ key: "setPerspective", value: function value(mFov, mAspectRatio, mNear, mFar) {
          this._fov = mFov, this._near = mNear, this._far = mFar, this._aspectRatio = mAspectRatio, _glMatrix.mat4.perspective(this._projection, mFov, mAspectRatio, mNear, mFar);
        } }, { key: "setAspectRatio", value: function value(mAspectRatio) {
          this._aspectRatio = mAspectRatio, _glMatrix.mat4.perspective(this.projection, this._fov, mAspectRatio, this._near, this._far);
        } }, { key: "generateRay", value: function value(mScreenPosition, mRay) {
          var proj = this.projectionMatrix,
              view = this.viewMatrix;return _glMatrix.mat4.multiply(mInverseViewProj, proj, view), _glMatrix.mat4.invert(mInverseViewProj, mInverseViewProj), _glMatrix.vec3.transformMat4(cameraDir, mScreenPosition, mInverseViewProj), _glMatrix.vec3.sub(cameraDir, cameraDir, this.position), _glMatrix.vec3.normalize(cameraDir, cameraDir), mRay ? (mRay.origin = this.position, mRay.direction = cameraDir) : mRay = new _Ray2.default(this.position, cameraDir), mRay;
        } }]), CameraPerspective;
    }(_Camera3.default);exports.default = CameraPerspective;
  }, function (module, exports, __webpack_require__) {
    "use strict";
    function _classCallCheck(instance, Constructor) {
      if (!(instance instanceof Constructor)) throw new TypeError("Cannot call a class as a function");
    }Object.defineProperty(exports, "__esModule", { value: !0 });var _createClass = function () {
      function defineProperties(target, props) {
        for (var i = 0; i < props.length; i++) {
          var descriptor = props[i];descriptor.enumerable = descriptor.enumerable || !1, descriptor.configurable = !0, "value" in descriptor && (descriptor.writable = !0), Object.defineProperty(target, descriptor.key, descriptor);
        }
      }return function (Constructor, protoProps, staticProps) {
        return protoProps && defineProperties(Constructor.prototype, protoProps), staticProps && defineProperties(Constructor, staticProps), Constructor;
      };
    }(),
        BinaryLoader = function () {
      function BinaryLoader() {
        var _this = this,
            isArrayBuffer = arguments.length > 0 && void 0 !== arguments[0] && arguments[0];_classCallCheck(this, BinaryLoader), this._req = new XMLHttpRequest(), this._req.addEventListener("load", function (e) {
          return _this._onLoaded(e);
        }), this._req.addEventListener("progress", function (e) {
          return _this._onProgress(e);
        }), isArrayBuffer && (this._req.responseType = "arraybuffer");
      }return _createClass(BinaryLoader, [{ key: "load", value: function value(url, callback) {
          console.log("Loading : ", url), this._callback = callback, this._req.open("GET", url), this._req.send();
        } }, { key: "_onLoaded", value: function value() {
          this._callback(this._req.response);
        } }, { key: "_onProgress", value: function value() {} }]), BinaryLoader;
    }();exports.default = BinaryLoader;
  }, function (module, exports) {
    module.exports = "// copy.frag\n\n#define SHADER_NAME COPY_FRAGMENT\n\nprecision mediump float;\n#define GLSLIFY 1\n\nvarying vec2 vTextureCoord;\nuniform sampler2D texture;\n\nvoid main(void) {\n    gl_FragColor = texture2D(texture, vTextureCoord);\n}";
  }, function (module, exports) {
    module.exports = "// simpleColor.frag\n\n#define SHADER_NAME SIMPLE_COLOR\n\nprecision mediump float;\n#define GLSLIFY 1\n\nuniform vec3 color;\nuniform float opacity;\n\nvoid main(void) {\n    gl_FragColor = vec4(color, opacity);\n}";
  }, function (module, exports, __webpack_require__) {
    "use strict";
    function create() {
      var out = new glMatrix.ARRAY_TYPE(9);return glMatrix.ARRAY_TYPE != Float32Array && (out[1] = 0, out[2] = 0, out[3] = 0, out[5] = 0, out[6] = 0, out[7] = 0), out[0] = 1, out[4] = 1, out[8] = 1, out;
    }function fromMat4(out, a) {
      return out[0] = a[0], out[1] = a[1], out[2] = a[2], out[3] = a[4], out[4] = a[5], out[5] = a[6], out[6] = a[8], out[7] = a[9], out[8] = a[10], out;
    }function clone(a) {
      var out = new glMatrix.ARRAY_TYPE(9);return out[0] = a[0], out[1] = a[1], out[2] = a[2], out[3] = a[3], out[4] = a[4], out[5] = a[5], out[6] = a[6], out[7] = a[7], out[8] = a[8], out;
    }function copy(out, a) {
      return out[0] = a[0], out[1] = a[1], out[2] = a[2], out[3] = a[3], out[4] = a[4], out[5] = a[5], out[6] = a[6], out[7] = a[7], out[8] = a[8], out;
    }function fromValues(m00, m01, m02, m10, m11, m12, m20, m21, m22) {
      var out = new glMatrix.ARRAY_TYPE(9);return out[0] = m00, out[1] = m01, out[2] = m02, out[3] = m10, out[4] = m11, out[5] = m12, out[6] = m20, out[7] = m21, out[8] = m22, out;
    }function set(out, m00, m01, m02, m10, m11, m12, m20, m21, m22) {
      return out[0] = m00, out[1] = m01, out[2] = m02, out[3] = m10, out[4] = m11, out[5] = m12, out[6] = m20, out[7] = m21, out[8] = m22, out;
    }function identity(out) {
      return out[0] = 1, out[1] = 0, out[2] = 0, out[3] = 0, out[4] = 1, out[5] = 0, out[6] = 0, out[7] = 0, out[8] = 1, out;
    }function transpose(out, a) {
      if (out === a) {
        var a01 = a[1],
            a02 = a[2],
            a12 = a[5];out[1] = a[3], out[2] = a[6], out[3] = a01, out[5] = a[7], out[6] = a02, out[7] = a12;
      } else out[0] = a[0], out[1] = a[3], out[2] = a[6], out[3] = a[1], out[4] = a[4], out[5] = a[7], out[6] = a[2], out[7] = a[5], out[8] = a[8];return out;
    }function invert(out, a) {
      var a00 = a[0],
          a01 = a[1],
          a02 = a[2],
          a10 = a[3],
          a11 = a[4],
          a12 = a[5],
          a20 = a[6],
          a21 = a[7],
          a22 = a[8],
          b01 = a22 * a11 - a12 * a21,
          b11 = -a22 * a10 + a12 * a20,
          b21 = a21 * a10 - a11 * a20,
          det = a00 * b01 + a01 * b11 + a02 * b21;return det ? (det = 1 / det, out[0] = b01 * det, out[1] = (-a22 * a01 + a02 * a21) * det, out[2] = (a12 * a01 - a02 * a11) * det, out[3] = b11 * det, out[4] = (a22 * a00 - a02 * a20) * det, out[5] = (-a12 * a00 + a02 * a10) * det, out[6] = b21 * det, out[7] = (-a21 * a00 + a01 * a20) * det, out[8] = (a11 * a00 - a01 * a10) * det, out) : null;
    }function adjoint(out, a) {
      var a00 = a[0],
          a01 = a[1],
          a02 = a[2],
          a10 = a[3],
          a11 = a[4],
          a12 = a[5],
          a20 = a[6],
          a21 = a[7],
          a22 = a[8];return out[0] = a11 * a22 - a12 * a21, out[1] = a02 * a21 - a01 * a22, out[2] = a01 * a12 - a02 * a11, out[3] = a12 * a20 - a10 * a22, out[4] = a00 * a22 - a02 * a20, out[5] = a02 * a10 - a00 * a12, out[6] = a10 * a21 - a11 * a20, out[7] = a01 * a20 - a00 * a21, out[8] = a00 * a11 - a01 * a10, out;
    }function determinant(a) {
      var a00 = a[0],
          a01 = a[1],
          a02 = a[2],
          a10 = a[3],
          a11 = a[4],
          a12 = a[5],
          a20 = a[6],
          a21 = a[7],
          a22 = a[8];return a00 * (a22 * a11 - a12 * a21) + a01 * (-a22 * a10 + a12 * a20) + a02 * (a21 * a10 - a11 * a20);
    }function multiply(out, a, b) {
      var a00 = a[0],
          a01 = a[1],
          a02 = a[2],
          a10 = a[3],
          a11 = a[4],
          a12 = a[5],
          a20 = a[6],
          a21 = a[7],
          a22 = a[8],
          b00 = b[0],
          b01 = b[1],
          b02 = b[2],
          b10 = b[3],
          b11 = b[4],
          b12 = b[5],
          b20 = b[6],
          b21 = b[7],
          b22 = b[8];return out[0] = b00 * a00 + b01 * a10 + b02 * a20, out[1] = b00 * a01 + b01 * a11 + b02 * a21, out[2] = b00 * a02 + b01 * a12 + b02 * a22, out[3] = b10 * a00 + b11 * a10 + b12 * a20, out[4] = b10 * a01 + b11 * a11 + b12 * a21, out[5] = b10 * a02 + b11 * a12 + b12 * a22, out[6] = b20 * a00 + b21 * a10 + b22 * a20, out[7] = b20 * a01 + b21 * a11 + b22 * a21, out[8] = b20 * a02 + b21 * a12 + b22 * a22, out;
    }function translate(out, a, v) {
      var a00 = a[0],
          a01 = a[1],
          a02 = a[2],
          a10 = a[3],
          a11 = a[4],
          a12 = a[5],
          a20 = a[6],
          a21 = a[7],
          a22 = a[8],
          x = v[0],
          y = v[1];return out[0] = a00, out[1] = a01, out[2] = a02, out[3] = a10, out[4] = a11, out[5] = a12, out[6] = x * a00 + y * a10 + a20, out[7] = x * a01 + y * a11 + a21, out[8] = x * a02 + y * a12 + a22, out;
    }function rotate(out, a, rad) {
      var a00 = a[0],
          a01 = a[1],
          a02 = a[2],
          a10 = a[3],
          a11 = a[4],
          a12 = a[5],
          a20 = a[6],
          a21 = a[7],
          a22 = a[8],
          s = Math.sin(rad),
          c = Math.cos(rad);return out[0] = c * a00 + s * a10, out[1] = c * a01 + s * a11, out[2] = c * a02 + s * a12, out[3] = c * a10 - s * a00, out[4] = c * a11 - s * a01, out[5] = c * a12 - s * a02, out[6] = a20, out[7] = a21, out[8] = a22, out;
    }function scale(out, a, v) {
      var x = v[0],
          y = v[1];return out[0] = x * a[0], out[1] = x * a[1], out[2] = x * a[2], out[3] = y * a[3], out[4] = y * a[4], out[5] = y * a[5], out[6] = a[6], out[7] = a[7], out[8] = a[8], out;
    }function fromTranslation(out, v) {
      return out[0] = 1, out[1] = 0, out[2] = 0, out[3] = 0, out[4] = 1, out[5] = 0, out[6] = v[0], out[7] = v[1], out[8] = 1, out;
    }function fromRotation(out, rad) {
      var s = Math.sin(rad),
          c = Math.cos(rad);return out[0] = c, out[1] = s, out[2] = 0, out[3] = -s, out[4] = c, out[5] = 0, out[6] = 0, out[7] = 0, out[8] = 1, out;
    }function fromScaling(out, v) {
      return out[0] = v[0], out[1] = 0, out[2] = 0, out[3] = 0, out[4] = v[1], out[5] = 0, out[6] = 0, out[7] = 0, out[8] = 1, out;
    }function fromMat2d(out, a) {
      return out[0] = a[0], out[1] = a[1], out[2] = 0, out[3] = a[2], out[4] = a[3], out[5] = 0, out[6] = a[4], out[7] = a[5], out[8] = 1, out;
    }function fromQuat(out, q) {
      var x = q[0],
          y = q[1],
          z = q[2],
          w = q[3],
          x2 = x + x,
          y2 = y + y,
          z2 = z + z,
          xx = x * x2,
          yx = y * x2,
          yy = y * y2,
          zx = z * x2,
          zy = z * y2,
          zz = z * z2,
          wx = w * x2,
          wy = w * y2,
          wz = w * z2;return out[0] = 1 - yy - zz, out[3] = yx - wz, out[6] = zx + wy, out[1] = yx + wz, out[4] = 1 - xx - zz, out[7] = zy - wx, out[2] = zx - wy, out[5] = zy + wx, out[8] = 1 - xx - yy, out;
    }function normalFromMat4(out, a) {
      var a00 = a[0],
          a01 = a[1],
          a02 = a[2],
          a03 = a[3],
          a10 = a[4],
          a11 = a[5],
          a12 = a[6],
          a13 = a[7],
          a20 = a[8],
          a21 = a[9],
          a22 = a[10],
          a23 = a[11],
          a30 = a[12],
          a31 = a[13],
          a32 = a[14],
          a33 = a[15],
          b00 = a00 * a11 - a01 * a10,
          b01 = a00 * a12 - a02 * a10,
          b02 = a00 * a13 - a03 * a10,
          b03 = a01 * a12 - a02 * a11,
          b04 = a01 * a13 - a03 * a11,
          b05 = a02 * a13 - a03 * a12,
          b06 = a20 * a31 - a21 * a30,
          b07 = a20 * a32 - a22 * a30,
          b08 = a20 * a33 - a23 * a30,
          b09 = a21 * a32 - a22 * a31,
          b10 = a21 * a33 - a23 * a31,
          b11 = a22 * a33 - a23 * a32,
          det = b00 * b11 - b01 * b10 + b02 * b09 + b03 * b08 - b04 * b07 + b05 * b06;return det ? (det = 1 / det, out[0] = (a11 * b11 - a12 * b10 + a13 * b09) * det, out[1] = (a12 * b08 - a10 * b11 - a13 * b07) * det, out[2] = (a10 * b10 - a11 * b08 + a13 * b06) * det, out[3] = (a02 * b10 - a01 * b11 - a03 * b09) * det, out[4] = (a00 * b11 - a02 * b08 + a03 * b07) * det, out[5] = (a01 * b08 - a00 * b10 - a03 * b06) * det, out[6] = (a31 * b05 - a32 * b04 + a33 * b03) * det, out[7] = (a32 * b02 - a30 * b05 - a33 * b01) * det, out[8] = (a30 * b04 - a31 * b02 + a33 * b00) * det, out) : null;
    }function projection(out, width, height) {
      return out[0] = 2 / width, out[1] = 0, out[2] = 0, out[3] = 0, out[4] = -2 / height, out[5] = 0, out[6] = -1, out[7] = 1, out[8] = 1, out;
    }function str(a) {
      return "mat3(" + a[0] + ", " + a[1] + ", " + a[2] + ", " + a[3] + ", " + a[4] + ", " + a[5] + ", " + a[6] + ", " + a[7] + ", " + a[8] + ")";
    }function frob(a) {
      return Math.sqrt(Math.pow(a[0], 2) + Math.pow(a[1], 2) + Math.pow(a[2], 2) + Math.pow(a[3], 2) + Math.pow(a[4], 2) + Math.pow(a[5], 2) + Math.pow(a[6], 2) + Math.pow(a[7], 2) + Math.pow(a[8], 2));
    }function add(out, a, b) {
      return out[0] = a[0] + b[0], out[1] = a[1] + b[1], out[2] = a[2] + b[2], out[3] = a[3] + b[3], out[4] = a[4] + b[4], out[5] = a[5] + b[5], out[6] = a[6] + b[6], out[7] = a[7] + b[7], out[8] = a[8] + b[8], out;
    }function subtract(out, a, b) {
      return out[0] = a[0] - b[0], out[1] = a[1] - b[1], out[2] = a[2] - b[2], out[3] = a[3] - b[3], out[4] = a[4] - b[4], out[5] = a[5] - b[5], out[6] = a[6] - b[6], out[7] = a[7] - b[7], out[8] = a[8] - b[8], out;
    }function multiplyScalar(out, a, b) {
      return out[0] = a[0] * b, out[1] = a[1] * b, out[2] = a[2] * b, out[3] = a[3] * b, out[4] = a[4] * b, out[5] = a[5] * b, out[6] = a[6] * b, out[7] = a[7] * b, out[8] = a[8] * b, out;
    }function multiplyScalarAndAdd(out, a, b, scale) {
      return out[0] = a[0] + b[0] * scale, out[1] = a[1] + b[1] * scale, out[2] = a[2] + b[2] * scale, out[3] = a[3] + b[3] * scale, out[4] = a[4] + b[4] * scale, out[5] = a[5] + b[5] * scale, out[6] = a[6] + b[6] * scale, out[7] = a[7] + b[7] * scale, out[8] = a[8] + b[8] * scale, out;
    }function exactEquals(a, b) {
      return a[0] === b[0] && a[1] === b[1] && a[2] === b[2] && a[3] === b[3] && a[4] === b[4] && a[5] === b[5] && a[6] === b[6] && a[7] === b[7] && a[8] === b[8];
    }function equals(a, b) {
      var a0 = a[0],
          a1 = a[1],
          a2 = a[2],
          a3 = a[3],
          a4 = a[4],
          a5 = a[5],
          a6 = a[6],
          a7 = a[7],
          a8 = a[8],
          b0 = b[0],
          b1 = b[1],
          b2 = b[2],
          b3 = b[3],
          b4 = b[4],
          b5 = b[5],
          b6 = b[6],
          b7 = b[7],
          b8 = b[8];return Math.abs(a0 - b0) <= glMatrix.EPSILON * Math.max(1, Math.abs(a0), Math.abs(b0)) && Math.abs(a1 - b1) <= glMatrix.EPSILON * Math.max(1, Math.abs(a1), Math.abs(b1)) && Math.abs(a2 - b2) <= glMatrix.EPSILON * Math.max(1, Math.abs(a2), Math.abs(b2)) && Math.abs(a3 - b3) <= glMatrix.EPSILON * Math.max(1, Math.abs(a3), Math.abs(b3)) && Math.abs(a4 - b4) <= glMatrix.EPSILON * Math.max(1, Math.abs(a4), Math.abs(b4)) && Math.abs(a5 - b5) <= glMatrix.EPSILON * Math.max(1, Math.abs(a5), Math.abs(b5)) && Math.abs(a6 - b6) <= glMatrix.EPSILON * Math.max(1, Math.abs(a6), Math.abs(b6)) && Math.abs(a7 - b7) <= glMatrix.EPSILON * Math.max(1, Math.abs(a7), Math.abs(b7)) && Math.abs(a8 - b8) <= glMatrix.EPSILON * Math.max(1, Math.abs(a8), Math.abs(b8));
    }Object.defineProperty(exports, "__esModule", { value: !0 }), exports.sub = exports.mul = void 0, exports.create = create, exports.fromMat4 = fromMat4, exports.clone = clone, exports.copy = copy, exports.fromValues = fromValues, exports.set = set, exports.identity = identity, exports.transpose = transpose, exports.invert = invert, exports.adjoint = adjoint, exports.determinant = determinant, exports.multiply = multiply, exports.translate = translate, exports.rotate = rotate, exports.scale = scale, exports.fromTranslation = fromTranslation, exports.fromRotation = fromRotation, exports.fromScaling = fromScaling, exports.fromMat2d = fromMat2d, exports.fromQuat = fromQuat, exports.normalFromMat4 = normalFromMat4, exports.projection = projection, exports.str = str, exports.frob = frob, exports.add = add, exports.subtract = subtract, exports.multiplyScalar = multiplyScalar, exports.multiplyScalarAndAdd = multiplyScalarAndAdd, exports.exactEquals = exactEquals, exports.equals = equals;var _common = __webpack_require__(3),
        glMatrix = function (obj) {
      if (obj && obj.__esModule) return obj;var newObj = {};if (null != obj) for (var key in obj) {
        Object.prototype.hasOwnProperty.call(obj, key) && (newObj[key] = obj[key]);
      }return newObj.default = obj, newObj;
    }(_common);exports.mul = multiply, exports.sub = subtract;
  }, function (module, exports, __webpack_require__) {
    "use strict";
    function create() {
      var out = new glMatrix.ARRAY_TYPE(16);return glMatrix.ARRAY_TYPE != Float32Array && (out[1] = 0, out[2] = 0, out[3] = 0, out[4] = 0, out[6] = 0, out[7] = 0, out[8] = 0, out[9] = 0, out[11] = 0, out[12] = 0, out[13] = 0, out[14] = 0), out[0] = 1, out[5] = 1, out[10] = 1, out[15] = 1, out;
    }function clone(a) {
      var out = new glMatrix.ARRAY_TYPE(16);return out[0] = a[0], out[1] = a[1], out[2] = a[2], out[3] = a[3], out[4] = a[4], out[5] = a[5], out[6] = a[6], out[7] = a[7], out[8] = a[8], out[9] = a[9], out[10] = a[10], out[11] = a[11], out[12] = a[12], out[13] = a[13], out[14] = a[14], out[15] = a[15], out;
    }function copy(out, a) {
      return out[0] = a[0], out[1] = a[1], out[2] = a[2], out[3] = a[3], out[4] = a[4], out[5] = a[5], out[6] = a[6], out[7] = a[7], out[8] = a[8], out[9] = a[9], out[10] = a[10], out[11] = a[11], out[12] = a[12], out[13] = a[13], out[14] = a[14], out[15] = a[15], out;
    }function fromValues(m00, m01, m02, m03, m10, m11, m12, m13, m20, m21, m22, m23, m30, m31, m32, m33) {
      var out = new glMatrix.ARRAY_TYPE(16);return out[0] = m00, out[1] = m01, out[2] = m02, out[3] = m03, out[4] = m10, out[5] = m11, out[6] = m12, out[7] = m13, out[8] = m20, out[9] = m21, out[10] = m22, out[11] = m23, out[12] = m30, out[13] = m31, out[14] = m32, out[15] = m33, out;
    }function set(out, m00, m01, m02, m03, m10, m11, m12, m13, m20, m21, m22, m23, m30, m31, m32, m33) {
      return out[0] = m00, out[1] = m01, out[2] = m02, out[3] = m03, out[4] = m10, out[5] = m11, out[6] = m12, out[7] = m13, out[8] = m20, out[9] = m21, out[10] = m22, out[11] = m23, out[12] = m30, out[13] = m31, out[14] = m32, out[15] = m33, out;
    }function identity(out) {
      return out[0] = 1, out[1] = 0, out[2] = 0, out[3] = 0, out[4] = 0, out[5] = 1, out[6] = 0, out[7] = 0, out[8] = 0, out[9] = 0, out[10] = 1, out[11] = 0, out[12] = 0, out[13] = 0, out[14] = 0, out[15] = 1, out;
    }function transpose(out, a) {
      if (out === a) {
        var a01 = a[1],
            a02 = a[2],
            a03 = a[3],
            a12 = a[6],
            a13 = a[7],
            a23 = a[11];out[1] = a[4], out[2] = a[8], out[3] = a[12], out[4] = a01, out[6] = a[9], out[7] = a[13], out[8] = a02, out[9] = a12, out[11] = a[14], out[12] = a03, out[13] = a13, out[14] = a23;
      } else out[0] = a[0], out[1] = a[4], out[2] = a[8], out[3] = a[12], out[4] = a[1], out[5] = a[5], out[6] = a[9], out[7] = a[13], out[8] = a[2], out[9] = a[6], out[10] = a[10], out[11] = a[14], out[12] = a[3], out[13] = a[7], out[14] = a[11], out[15] = a[15];return out;
    }function invert(out, a) {
      var a00 = a[0],
          a01 = a[1],
          a02 = a[2],
          a03 = a[3],
          a10 = a[4],
          a11 = a[5],
          a12 = a[6],
          a13 = a[7],
          a20 = a[8],
          a21 = a[9],
          a22 = a[10],
          a23 = a[11],
          a30 = a[12],
          a31 = a[13],
          a32 = a[14],
          a33 = a[15],
          b00 = a00 * a11 - a01 * a10,
          b01 = a00 * a12 - a02 * a10,
          b02 = a00 * a13 - a03 * a10,
          b03 = a01 * a12 - a02 * a11,
          b04 = a01 * a13 - a03 * a11,
          b05 = a02 * a13 - a03 * a12,
          b06 = a20 * a31 - a21 * a30,
          b07 = a20 * a32 - a22 * a30,
          b08 = a20 * a33 - a23 * a30,
          b09 = a21 * a32 - a22 * a31,
          b10 = a21 * a33 - a23 * a31,
          b11 = a22 * a33 - a23 * a32,
          det = b00 * b11 - b01 * b10 + b02 * b09 + b03 * b08 - b04 * b07 + b05 * b06;return det ? (det = 1 / det, out[0] = (a11 * b11 - a12 * b10 + a13 * b09) * det, out[1] = (a02 * b10 - a01 * b11 - a03 * b09) * det, out[2] = (a31 * b05 - a32 * b04 + a33 * b03) * det, out[3] = (a22 * b04 - a21 * b05 - a23 * b03) * det, out[4] = (a12 * b08 - a10 * b11 - a13 * b07) * det, out[5] = (a00 * b11 - a02 * b08 + a03 * b07) * det, out[6] = (a32 * b02 - a30 * b05 - a33 * b01) * det, out[7] = (a20 * b05 - a22 * b02 + a23 * b01) * det, out[8] = (a10 * b10 - a11 * b08 + a13 * b06) * det, out[9] = (a01 * b08 - a00 * b10 - a03 * b06) * det, out[10] = (a30 * b04 - a31 * b02 + a33 * b00) * det, out[11] = (a21 * b02 - a20 * b04 - a23 * b00) * det, out[12] = (a11 * b07 - a10 * b09 - a12 * b06) * det, out[13] = (a00 * b09 - a01 * b07 + a02 * b06) * det, out[14] = (a31 * b01 - a30 * b03 - a32 * b00) * det, out[15] = (a20 * b03 - a21 * b01 + a22 * b00) * det, out) : null;
    }function adjoint(out, a) {
      var a00 = a[0],
          a01 = a[1],
          a02 = a[2],
          a03 = a[3],
          a10 = a[4],
          a11 = a[5],
          a12 = a[6],
          a13 = a[7],
          a20 = a[8],
          a21 = a[9],
          a22 = a[10],
          a23 = a[11],
          a30 = a[12],
          a31 = a[13],
          a32 = a[14],
          a33 = a[15];return out[0] = a11 * (a22 * a33 - a23 * a32) - a21 * (a12 * a33 - a13 * a32) + a31 * (a12 * a23 - a13 * a22), out[1] = -(a01 * (a22 * a33 - a23 * a32) - a21 * (a02 * a33 - a03 * a32) + a31 * (a02 * a23 - a03 * a22)), out[2] = a01 * (a12 * a33 - a13 * a32) - a11 * (a02 * a33 - a03 * a32) + a31 * (a02 * a13 - a03 * a12), out[3] = -(a01 * (a12 * a23 - a13 * a22) - a11 * (a02 * a23 - a03 * a22) + a21 * (a02 * a13 - a03 * a12)), out[4] = -(a10 * (a22 * a33 - a23 * a32) - a20 * (a12 * a33 - a13 * a32) + a30 * (a12 * a23 - a13 * a22)), out[5] = a00 * (a22 * a33 - a23 * a32) - a20 * (a02 * a33 - a03 * a32) + a30 * (a02 * a23 - a03 * a22), out[6] = -(a00 * (a12 * a33 - a13 * a32) - a10 * (a02 * a33 - a03 * a32) + a30 * (a02 * a13 - a03 * a12)), out[7] = a00 * (a12 * a23 - a13 * a22) - a10 * (a02 * a23 - a03 * a22) + a20 * (a02 * a13 - a03 * a12), out[8] = a10 * (a21 * a33 - a23 * a31) - a20 * (a11 * a33 - a13 * a31) + a30 * (a11 * a23 - a13 * a21), out[9] = -(a00 * (a21 * a33 - a23 * a31) - a20 * (a01 * a33 - a03 * a31) + a30 * (a01 * a23 - a03 * a21)), out[10] = a00 * (a11 * a33 - a13 * a31) - a10 * (a01 * a33 - a03 * a31) + a30 * (a01 * a13 - a03 * a11), out[11] = -(a00 * (a11 * a23 - a13 * a21) - a10 * (a01 * a23 - a03 * a21) + a20 * (a01 * a13 - a03 * a11)), out[12] = -(a10 * (a21 * a32 - a22 * a31) - a20 * (a11 * a32 - a12 * a31) + a30 * (a11 * a22 - a12 * a21)), out[13] = a00 * (a21 * a32 - a22 * a31) - a20 * (a01 * a32 - a02 * a31) + a30 * (a01 * a22 - a02 * a21), out[14] = -(a00 * (a11 * a32 - a12 * a31) - a10 * (a01 * a32 - a02 * a31) + a30 * (a01 * a12 - a02 * a11)), out[15] = a00 * (a11 * a22 - a12 * a21) - a10 * (a01 * a22 - a02 * a21) + a20 * (a01 * a12 - a02 * a11), out;
    }function determinant(a) {
      var a00 = a[0],
          a01 = a[1],
          a02 = a[2],
          a03 = a[3],
          a10 = a[4],
          a11 = a[5],
          a12 = a[6],
          a13 = a[7],
          a20 = a[8],
          a21 = a[9],
          a22 = a[10],
          a23 = a[11],
          a30 = a[12],
          a31 = a[13],
          a32 = a[14],
          a33 = a[15];return (a00 * a11 - a01 * a10) * (a22 * a33 - a23 * a32) - (a00 * a12 - a02 * a10) * (a21 * a33 - a23 * a31) + (a00 * a13 - a03 * a10) * (a21 * a32 - a22 * a31) + (a01 * a12 - a02 * a11) * (a20 * a33 - a23 * a30) - (a01 * a13 - a03 * a11) * (a20 * a32 - a22 * a30) + (a02 * a13 - a03 * a12) * (a20 * a31 - a21 * a30);
    }function multiply(out, a, b) {
      var a00 = a[0],
          a01 = a[1],
          a02 = a[2],
          a03 = a[3],
          a10 = a[4],
          a11 = a[5],
          a12 = a[6],
          a13 = a[7],
          a20 = a[8],
          a21 = a[9],
          a22 = a[10],
          a23 = a[11],
          a30 = a[12],
          a31 = a[13],
          a32 = a[14],
          a33 = a[15],
          b0 = b[0],
          b1 = b[1],
          b2 = b[2],
          b3 = b[3];return out[0] = b0 * a00 + b1 * a10 + b2 * a20 + b3 * a30, out[1] = b0 * a01 + b1 * a11 + b2 * a21 + b3 * a31, out[2] = b0 * a02 + b1 * a12 + b2 * a22 + b3 * a32, out[3] = b0 * a03 + b1 * a13 + b2 * a23 + b3 * a33, b0 = b[4], b1 = b[5], b2 = b[6], b3 = b[7], out[4] = b0 * a00 + b1 * a10 + b2 * a20 + b3 * a30, out[5] = b0 * a01 + b1 * a11 + b2 * a21 + b3 * a31, out[6] = b0 * a02 + b1 * a12 + b2 * a22 + b3 * a32, out[7] = b0 * a03 + b1 * a13 + b2 * a23 + b3 * a33, b0 = b[8], b1 = b[9], b2 = b[10], b3 = b[11], out[8] = b0 * a00 + b1 * a10 + b2 * a20 + b3 * a30, out[9] = b0 * a01 + b1 * a11 + b2 * a21 + b3 * a31, out[10] = b0 * a02 + b1 * a12 + b2 * a22 + b3 * a32, out[11] = b0 * a03 + b1 * a13 + b2 * a23 + b3 * a33, b0 = b[12], b1 = b[13], b2 = b[14], b3 = b[15], out[12] = b0 * a00 + b1 * a10 + b2 * a20 + b3 * a30, out[13] = b0 * a01 + b1 * a11 + b2 * a21 + b3 * a31, out[14] = b0 * a02 + b1 * a12 + b2 * a22 + b3 * a32, out[15] = b0 * a03 + b1 * a13 + b2 * a23 + b3 * a33, out;
    }function translate(out, a, v) {
      var x = v[0],
          y = v[1],
          z = v[2],
          a00 = void 0,
          a01 = void 0,
          a02 = void 0,
          a03 = void 0,
          a10 = void 0,
          a11 = void 0,
          a12 = void 0,
          a13 = void 0,
          a20 = void 0,
          a21 = void 0,
          a22 = void 0,
          a23 = void 0;return a === out ? (out[12] = a[0] * x + a[4] * y + a[8] * z + a[12], out[13] = a[1] * x + a[5] * y + a[9] * z + a[13], out[14] = a[2] * x + a[6] * y + a[10] * z + a[14], out[15] = a[3] * x + a[7] * y + a[11] * z + a[15]) : (a00 = a[0], a01 = a[1], a02 = a[2], a03 = a[3], a10 = a[4], a11 = a[5], a12 = a[6], a13 = a[7], a20 = a[8], a21 = a[9], a22 = a[10], a23 = a[11], out[0] = a00, out[1] = a01, out[2] = a02, out[3] = a03, out[4] = a10, out[5] = a11, out[6] = a12, out[7] = a13, out[8] = a20, out[9] = a21, out[10] = a22, out[11] = a23, out[12] = a00 * x + a10 * y + a20 * z + a[12], out[13] = a01 * x + a11 * y + a21 * z + a[13], out[14] = a02 * x + a12 * y + a22 * z + a[14], out[15] = a03 * x + a13 * y + a23 * z + a[15]), out;
    }function scale(out, a, v) {
      var x = v[0],
          y = v[1],
          z = v[2];return out[0] = a[0] * x, out[1] = a[1] * x, out[2] = a[2] * x, out[3] = a[3] * x, out[4] = a[4] * y, out[5] = a[5] * y, out[6] = a[6] * y, out[7] = a[7] * y, out[8] = a[8] * z, out[9] = a[9] * z, out[10] = a[10] * z, out[11] = a[11] * z, out[12] = a[12], out[13] = a[13], out[14] = a[14], out[15] = a[15], out;
    }function rotate(out, a, rad, axis) {
      var x = axis[0],
          y = axis[1],
          z = axis[2],
          len = Math.sqrt(x * x + y * y + z * z),
          s = void 0,
          c = void 0,
          t = void 0,
          a00 = void 0,
          a01 = void 0,
          a02 = void 0,
          a03 = void 0,
          a10 = void 0,
          a11 = void 0,
          a12 = void 0,
          a13 = void 0,
          a20 = void 0,
          a21 = void 0,
          a22 = void 0,
          a23 = void 0,
          b00 = void 0,
          b01 = void 0,
          b02 = void 0,
          b10 = void 0,
          b11 = void 0,
          b12 = void 0,
          b20 = void 0,
          b21 = void 0,
          b22 = void 0;return len < glMatrix.EPSILON ? null : (len = 1 / len, x *= len, y *= len, z *= len, s = Math.sin(rad), c = Math.cos(rad), t = 1 - c, a00 = a[0], a01 = a[1], a02 = a[2], a03 = a[3], a10 = a[4], a11 = a[5], a12 = a[6], a13 = a[7], a20 = a[8], a21 = a[9], a22 = a[10], a23 = a[11], b00 = x * x * t + c, b01 = y * x * t + z * s, b02 = z * x * t - y * s, b10 = x * y * t - z * s, b11 = y * y * t + c, b12 = z * y * t + x * s, b20 = x * z * t + y * s, b21 = y * z * t - x * s, b22 = z * z * t + c, out[0] = a00 * b00 + a10 * b01 + a20 * b02, out[1] = a01 * b00 + a11 * b01 + a21 * b02, out[2] = a02 * b00 + a12 * b01 + a22 * b02, out[3] = a03 * b00 + a13 * b01 + a23 * b02, out[4] = a00 * b10 + a10 * b11 + a20 * b12, out[5] = a01 * b10 + a11 * b11 + a21 * b12, out[6] = a02 * b10 + a12 * b11 + a22 * b12, out[7] = a03 * b10 + a13 * b11 + a23 * b12, out[8] = a00 * b20 + a10 * b21 + a20 * b22, out[9] = a01 * b20 + a11 * b21 + a21 * b22, out[10] = a02 * b20 + a12 * b21 + a22 * b22, out[11] = a03 * b20 + a13 * b21 + a23 * b22, a !== out && (out[12] = a[12], out[13] = a[13], out[14] = a[14], out[15] = a[15]), out);
    }function rotateX(out, a, rad) {
      var s = Math.sin(rad),
          c = Math.cos(rad),
          a10 = a[4],
          a11 = a[5],
          a12 = a[6],
          a13 = a[7],
          a20 = a[8],
          a21 = a[9],
          a22 = a[10],
          a23 = a[11];return a !== out && (out[0] = a[0], out[1] = a[1], out[2] = a[2], out[3] = a[3], out[12] = a[12], out[13] = a[13], out[14] = a[14], out[15] = a[15]), out[4] = a10 * c + a20 * s, out[5] = a11 * c + a21 * s, out[6] = a12 * c + a22 * s, out[7] = a13 * c + a23 * s, out[8] = a20 * c - a10 * s, out[9] = a21 * c - a11 * s, out[10] = a22 * c - a12 * s, out[11] = a23 * c - a13 * s, out;
    }function rotateY(out, a, rad) {
      var s = Math.sin(rad),
          c = Math.cos(rad),
          a00 = a[0],
          a01 = a[1],
          a02 = a[2],
          a03 = a[3],
          a20 = a[8],
          a21 = a[9],
          a22 = a[10],
          a23 = a[11];return a !== out && (out[4] = a[4], out[5] = a[5], out[6] = a[6], out[7] = a[7], out[12] = a[12], out[13] = a[13], out[14] = a[14], out[15] = a[15]), out[0] = a00 * c - a20 * s, out[1] = a01 * c - a21 * s, out[2] = a02 * c - a22 * s, out[3] = a03 * c - a23 * s, out[8] = a00 * s + a20 * c, out[9] = a01 * s + a21 * c, out[10] = a02 * s + a22 * c, out[11] = a03 * s + a23 * c, out;
    }function rotateZ(out, a, rad) {
      var s = Math.sin(rad),
          c = Math.cos(rad),
          a00 = a[0],
          a01 = a[1],
          a02 = a[2],
          a03 = a[3],
          a10 = a[4],
          a11 = a[5],
          a12 = a[6],
          a13 = a[7];return a !== out && (out[8] = a[8], out[9] = a[9], out[10] = a[10], out[11] = a[11], out[12] = a[12], out[13] = a[13], out[14] = a[14], out[15] = a[15]), out[0] = a00 * c + a10 * s, out[1] = a01 * c + a11 * s, out[2] = a02 * c + a12 * s, out[3] = a03 * c + a13 * s, out[4] = a10 * c - a00 * s, out[5] = a11 * c - a01 * s, out[6] = a12 * c - a02 * s, out[7] = a13 * c - a03 * s, out;
    }function fromTranslation(out, v) {
      return out[0] = 1, out[1] = 0, out[2] = 0, out[3] = 0, out[4] = 0, out[5] = 1, out[6] = 0, out[7] = 0, out[8] = 0, out[9] = 0, out[10] = 1, out[11] = 0, out[12] = v[0], out[13] = v[1], out[14] = v[2], out[15] = 1, out;
    }function fromScaling(out, v) {
      return out[0] = v[0], out[1] = 0, out[2] = 0, out[3] = 0, out[4] = 0, out[5] = v[1], out[6] = 0, out[7] = 0, out[8] = 0, out[9] = 0, out[10] = v[2], out[11] = 0, out[12] = 0, out[13] = 0, out[14] = 0, out[15] = 1, out;
    }function fromRotation(out, rad, axis) {
      var x = axis[0],
          y = axis[1],
          z = axis[2],
          len = Math.sqrt(x * x + y * y + z * z),
          s = void 0,
          c = void 0,
          t = void 0;return len < glMatrix.EPSILON ? null : (len = 1 / len, x *= len, y *= len, z *= len, s = Math.sin(rad), c = Math.cos(rad), t = 1 - c, out[0] = x * x * t + c, out[1] = y * x * t + z * s, out[2] = z * x * t - y * s, out[3] = 0, out[4] = x * y * t - z * s, out[5] = y * y * t + c, out[6] = z * y * t + x * s, out[7] = 0, out[8] = x * z * t + y * s, out[9] = y * z * t - x * s, out[10] = z * z * t + c, out[11] = 0, out[12] = 0, out[13] = 0, out[14] = 0, out[15] = 1, out);
    }function fromXRotation(out, rad) {
      var s = Math.sin(rad),
          c = Math.cos(rad);return out[0] = 1, out[1] = 0, out[2] = 0, out[3] = 0, out[4] = 0, out[5] = c, out[6] = s, out[7] = 0, out[8] = 0, out[9] = -s, out[10] = c, out[11] = 0, out[12] = 0, out[13] = 0, out[14] = 0, out[15] = 1, out;
    }function fromYRotation(out, rad) {
      var s = Math.sin(rad),
          c = Math.cos(rad);return out[0] = c, out[1] = 0, out[2] = -s, out[3] = 0, out[4] = 0, out[5] = 1, out[6] = 0, out[7] = 0, out[8] = s, out[9] = 0, out[10] = c, out[11] = 0, out[12] = 0, out[13] = 0, out[14] = 0, out[15] = 1, out;
    }function fromZRotation(out, rad) {
      var s = Math.sin(rad),
          c = Math.cos(rad);return out[0] = c, out[1] = s, out[2] = 0, out[3] = 0, out[4] = -s, out[5] = c, out[6] = 0, out[7] = 0, out[8] = 0, out[9] = 0, out[10] = 1, out[11] = 0, out[12] = 0, out[13] = 0, out[14] = 0, out[15] = 1, out;
    }function fromRotationTranslation(out, q, v) {
      var x = q[0],
          y = q[1],
          z = q[2],
          w = q[3],
          x2 = x + x,
          y2 = y + y,
          z2 = z + z,
          xx = x * x2,
          xy = x * y2,
          xz = x * z2,
          yy = y * y2,
          yz = y * z2,
          zz = z * z2,
          wx = w * x2,
          wy = w * y2,
          wz = w * z2;return out[0] = 1 - (yy + zz), out[1] = xy + wz, out[2] = xz - wy, out[3] = 0, out[4] = xy - wz, out[5] = 1 - (xx + zz), out[6] = yz + wx, out[7] = 0, out[8] = xz + wy, out[9] = yz - wx, out[10] = 1 - (xx + yy), out[11] = 0, out[12] = v[0], out[13] = v[1], out[14] = v[2], out[15] = 1, out;
    }function fromQuat2(out, a) {
      var translation = new glMatrix.ARRAY_TYPE(3),
          bx = -a[0],
          by = -a[1],
          bz = -a[2],
          bw = a[3],
          ax = a[4],
          ay = a[5],
          az = a[6],
          aw = a[7],
          magnitude = bx * bx + by * by + bz * bz + bw * bw;return magnitude > 0 ? (translation[0] = 2 * (ax * bw + aw * bx + ay * bz - az * by) / magnitude, translation[1] = 2 * (ay * bw + aw * by + az * bx - ax * bz) / magnitude, translation[2] = 2 * (az * bw + aw * bz + ax * by - ay * bx) / magnitude) : (translation[0] = 2 * (ax * bw + aw * bx + ay * bz - az * by), translation[1] = 2 * (ay * bw + aw * by + az * bx - ax * bz), translation[2] = 2 * (az * bw + aw * bz + ax * by - ay * bx)), fromRotationTranslation(out, a, translation), out;
    }function getTranslation(out, mat) {
      return out[0] = mat[12], out[1] = mat[13], out[2] = mat[14], out;
    }function getScaling(out, mat) {
      var m11 = mat[0],
          m12 = mat[1],
          m13 = mat[2],
          m21 = mat[4],
          m22 = mat[5],
          m23 = mat[6],
          m31 = mat[8],
          m32 = mat[9],
          m33 = mat[10];return out[0] = Math.sqrt(m11 * m11 + m12 * m12 + m13 * m13), out[1] = Math.sqrt(m21 * m21 + m22 * m22 + m23 * m23), out[2] = Math.sqrt(m31 * m31 + m32 * m32 + m33 * m33), out;
    }function getRotation(out, mat) {
      var trace = mat[0] + mat[5] + mat[10],
          S = 0;return trace > 0 ? (S = 2 * Math.sqrt(trace + 1), out[3] = .25 * S, out[0] = (mat[6] - mat[9]) / S, out[1] = (mat[8] - mat[2]) / S, out[2] = (mat[1] - mat[4]) / S) : mat[0] > mat[5] && mat[0] > mat[10] ? (S = 2 * Math.sqrt(1 + mat[0] - mat[5] - mat[10]), out[3] = (mat[6] - mat[9]) / S, out[0] = .25 * S, out[1] = (mat[1] + mat[4]) / S, out[2] = (mat[8] + mat[2]) / S) : mat[5] > mat[10] ? (S = 2 * Math.sqrt(1 + mat[5] - mat[0] - mat[10]), out[3] = (mat[8] - mat[2]) / S, out[0] = (mat[1] + mat[4]) / S, out[1] = .25 * S, out[2] = (mat[6] + mat[9]) / S) : (S = 2 * Math.sqrt(1 + mat[10] - mat[0] - mat[5]), out[3] = (mat[1] - mat[4]) / S, out[0] = (mat[8] + mat[2]) / S, out[1] = (mat[6] + mat[9]) / S, out[2] = .25 * S), out;
    }function fromRotationTranslationScale(out, q, v, s) {
      var x = q[0],
          y = q[1],
          z = q[2],
          w = q[3],
          x2 = x + x,
          y2 = y + y,
          z2 = z + z,
          xx = x * x2,
          xy = x * y2,
          xz = x * z2,
          yy = y * y2,
          yz = y * z2,
          zz = z * z2,
          wx = w * x2,
          wy = w * y2,
          wz = w * z2,
          sx = s[0],
          sy = s[1],
          sz = s[2];return out[0] = (1 - (yy + zz)) * sx, out[1] = (xy + wz) * sx, out[2] = (xz - wy) * sx, out[3] = 0, out[4] = (xy - wz) * sy, out[5] = (1 - (xx + zz)) * sy, out[6] = (yz + wx) * sy, out[7] = 0, out[8] = (xz + wy) * sz, out[9] = (yz - wx) * sz, out[10] = (1 - (xx + yy)) * sz, out[11] = 0, out[12] = v[0], out[13] = v[1], out[14] = v[2], out[15] = 1, out;
    }function fromRotationTranslationScaleOrigin(out, q, v, s, o) {
      var x = q[0],
          y = q[1],
          z = q[2],
          w = q[3],
          x2 = x + x,
          y2 = y + y,
          z2 = z + z,
          xx = x * x2,
          xy = x * y2,
          xz = x * z2,
          yy = y * y2,
          yz = y * z2,
          zz = z * z2,
          wx = w * x2,
          wy = w * y2,
          wz = w * z2,
          sx = s[0],
          sy = s[1],
          sz = s[2],
          ox = o[0],
          oy = o[1],
          oz = o[2],
          out0 = (1 - (yy + zz)) * sx,
          out1 = (xy + wz) * sx,
          out2 = (xz - wy) * sx,
          out4 = (xy - wz) * sy,
          out5 = (1 - (xx + zz)) * sy,
          out6 = (yz + wx) * sy,
          out8 = (xz + wy) * sz,
          out9 = (yz - wx) * sz,
          out10 = (1 - (xx + yy)) * sz;return out[0] = out0, out[1] = out1, out[2] = out2, out[3] = 0, out[4] = out4, out[5] = out5, out[6] = out6, out[7] = 0, out[8] = out8, out[9] = out9, out[10] = out10, out[11] = 0, out[12] = v[0] + ox - (out0 * ox + out4 * oy + out8 * oz), out[13] = v[1] + oy - (out1 * ox + out5 * oy + out9 * oz), out[14] = v[2] + oz - (out2 * ox + out6 * oy + out10 * oz), out[15] = 1, out;
    }function fromQuat(out, q) {
      var x = q[0],
          y = q[1],
          z = q[2],
          w = q[3],
          x2 = x + x,
          y2 = y + y,
          z2 = z + z,
          xx = x * x2,
          yx = y * x2,
          yy = y * y2,
          zx = z * x2,
          zy = z * y2,
          zz = z * z2,
          wx = w * x2,
          wy = w * y2,
          wz = w * z2;return out[0] = 1 - yy - zz, out[1] = yx + wz, out[2] = zx - wy, out[3] = 0, out[4] = yx - wz, out[5] = 1 - xx - zz, out[6] = zy + wx, out[7] = 0, out[8] = zx + wy, out[9] = zy - wx, out[10] = 1 - xx - yy, out[11] = 0, out[12] = 0, out[13] = 0, out[14] = 0, out[15] = 1, out;
    }function frustum(out, left, right, bottom, top, near, far) {
      var rl = 1 / (right - left),
          tb = 1 / (top - bottom),
          nf = 1 / (near - far);return out[0] = 2 * near * rl, out[1] = 0, out[2] = 0, out[3] = 0, out[4] = 0, out[5] = 2 * near * tb, out[6] = 0, out[7] = 0, out[8] = (right + left) * rl, out[9] = (top + bottom) * tb, out[10] = (far + near) * nf, out[11] = -1, out[12] = 0, out[13] = 0, out[14] = far * near * 2 * nf, out[15] = 0, out;
    }function perspective(out, fovy, aspect, near, far) {
      var f = 1 / Math.tan(fovy / 2),
          nf = void 0;return out[0] = f / aspect, out[1] = 0, out[2] = 0, out[3] = 0, out[4] = 0, out[5] = f, out[6] = 0, out[7] = 0, out[8] = 0, out[9] = 0, out[11] = -1, out[12] = 0, out[13] = 0, out[15] = 0, null != far && far !== 1 / 0 ? (nf = 1 / (near - far), out[10] = (far + near) * nf, out[14] = 2 * far * near * nf) : (out[10] = -1, out[14] = -2 * near), out;
    }function perspectiveFromFieldOfView(out, fov, near, far) {
      var upTan = Math.tan(fov.upDegrees * Math.PI / 180),
          downTan = Math.tan(fov.downDegrees * Math.PI / 180),
          leftTan = Math.tan(fov.leftDegrees * Math.PI / 180),
          rightTan = Math.tan(fov.rightDegrees * Math.PI / 180),
          xScale = 2 / (leftTan + rightTan),
          yScale = 2 / (upTan + downTan);return out[0] = xScale, out[1] = 0, out[2] = 0, out[3] = 0, out[4] = 0, out[5] = yScale, out[6] = 0, out[7] = 0, out[8] = -(leftTan - rightTan) * xScale * .5, out[9] = (upTan - downTan) * yScale * .5, out[10] = far / (near - far), out[11] = -1, out[12] = 0, out[13] = 0, out[14] = far * near / (near - far), out[15] = 0, out;
    }function ortho(out, left, right, bottom, top, near, far) {
      var lr = 1 / (left - right),
          bt = 1 / (bottom - top),
          nf = 1 / (near - far);return out[0] = -2 * lr, out[1] = 0, out[2] = 0, out[3] = 0, out[4] = 0, out[5] = -2 * bt, out[6] = 0, out[7] = 0, out[8] = 0, out[9] = 0, out[10] = 2 * nf, out[11] = 0, out[12] = (left + right) * lr, out[13] = (top + bottom) * bt, out[14] = (far + near) * nf, out[15] = 1, out;
    }function lookAt(out, eye, center, up) {
      var x0 = void 0,
          x1 = void 0,
          x2 = void 0,
          y0 = void 0,
          y1 = void 0,
          y2 = void 0,
          z0 = void 0,
          z1 = void 0,
          z2 = void 0,
          len = void 0,
          eyex = eye[0],
          eyey = eye[1],
          eyez = eye[2],
          upx = up[0],
          upy = up[1],
          upz = up[2],
          centerx = center[0],
          centery = center[1],
          centerz = center[2];return Math.abs(eyex - centerx) < glMatrix.EPSILON && Math.abs(eyey - centery) < glMatrix.EPSILON && Math.abs(eyez - centerz) < glMatrix.EPSILON ? identity(out) : (z0 = eyex - centerx, z1 = eyey - centery, z2 = eyez - centerz, len = 1 / Math.sqrt(z0 * z0 + z1 * z1 + z2 * z2), z0 *= len, z1 *= len, z2 *= len, x0 = upy * z2 - upz * z1, x1 = upz * z0 - upx * z2, x2 = upx * z1 - upy * z0, len = Math.sqrt(x0 * x0 + x1 * x1 + x2 * x2), len ? (len = 1 / len, x0 *= len, x1 *= len, x2 *= len) : (x0 = 0, x1 = 0, x2 = 0), y0 = z1 * x2 - z2 * x1, y1 = z2 * x0 - z0 * x2, y2 = z0 * x1 - z1 * x0, len = Math.sqrt(y0 * y0 + y1 * y1 + y2 * y2), len ? (len = 1 / len, y0 *= len, y1 *= len, y2 *= len) : (y0 = 0, y1 = 0, y2 = 0), out[0] = x0, out[1] = y0, out[2] = z0, out[3] = 0, out[4] = x1, out[5] = y1, out[6] = z1, out[7] = 0, out[8] = x2, out[9] = y2, out[10] = z2, out[11] = 0, out[12] = -(x0 * eyex + x1 * eyey + x2 * eyez), out[13] = -(y0 * eyex + y1 * eyey + y2 * eyez), out[14] = -(z0 * eyex + z1 * eyey + z2 * eyez), out[15] = 1, out);
    }function targetTo(out, eye, target, up) {
      var eyex = eye[0],
          eyey = eye[1],
          eyez = eye[2],
          upx = up[0],
          upy = up[1],
          upz = up[2],
          z0 = eyex - target[0],
          z1 = eyey - target[1],
          z2 = eyez - target[2],
          len = z0 * z0 + z1 * z1 + z2 * z2;len > 0 && (len = 1 / Math.sqrt(len), z0 *= len, z1 *= len, z2 *= len);var x0 = upy * z2 - upz * z1,
          x1 = upz * z0 - upx * z2,
          x2 = upx * z1 - upy * z0;return len = x0 * x0 + x1 * x1 + x2 * x2, len > 0 && (len = 1 / Math.sqrt(len), x0 *= len, x1 *= len, x2 *= len), out[0] = x0, out[1] = x1, out[2] = x2, out[3] = 0, out[4] = z1 * x2 - z2 * x1, out[5] = z2 * x0 - z0 * x2, out[6] = z0 * x1 - z1 * x0, out[7] = 0, out[8] = z0, out[9] = z1, out[10] = z2, out[11] = 0, out[12] = eyex, out[13] = eyey, out[14] = eyez, out[15] = 1, out;
    }function str(a) {
      return "mat4(" + a[0] + ", " + a[1] + ", " + a[2] + ", " + a[3] + ", " + a[4] + ", " + a[5] + ", " + a[6] + ", " + a[7] + ", " + a[8] + ", " + a[9] + ", " + a[10] + ", " + a[11] + ", " + a[12] + ", " + a[13] + ", " + a[14] + ", " + a[15] + ")";
    }function frob(a) {
      return Math.sqrt(Math.pow(a[0], 2) + Math.pow(a[1], 2) + Math.pow(a[2], 2) + Math.pow(a[3], 2) + Math.pow(a[4], 2) + Math.pow(a[5], 2) + Math.pow(a[6], 2) + Math.pow(a[7], 2) + Math.pow(a[8], 2) + Math.pow(a[9], 2) + Math.pow(a[10], 2) + Math.pow(a[11], 2) + Math.pow(a[12], 2) + Math.pow(a[13], 2) + Math.pow(a[14], 2) + Math.pow(a[15], 2));
    }function add(out, a, b) {
      return out[0] = a[0] + b[0], out[1] = a[1] + b[1], out[2] = a[2] + b[2], out[3] = a[3] + b[3], out[4] = a[4] + b[4], out[5] = a[5] + b[5], out[6] = a[6] + b[6], out[7] = a[7] + b[7], out[8] = a[8] + b[8], out[9] = a[9] + b[9], out[10] = a[10] + b[10], out[11] = a[11] + b[11], out[12] = a[12] + b[12], out[13] = a[13] + b[13], out[14] = a[14] + b[14], out[15] = a[15] + b[15], out;
    }function subtract(out, a, b) {
      return out[0] = a[0] - b[0], out[1] = a[1] - b[1], out[2] = a[2] - b[2], out[3] = a[3] - b[3], out[4] = a[4] - b[4], out[5] = a[5] - b[5], out[6] = a[6] - b[6], out[7] = a[7] - b[7], out[8] = a[8] - b[8], out[9] = a[9] - b[9], out[10] = a[10] - b[10], out[11] = a[11] - b[11], out[12] = a[12] - b[12], out[13] = a[13] - b[13], out[14] = a[14] - b[14], out[15] = a[15] - b[15], out;
    }function multiplyScalar(out, a, b) {
      return out[0] = a[0] * b, out[1] = a[1] * b, out[2] = a[2] * b, out[3] = a[3] * b, out[4] = a[4] * b, out[5] = a[5] * b, out[6] = a[6] * b, out[7] = a[7] * b, out[8] = a[8] * b, out[9] = a[9] * b, out[10] = a[10] * b, out[11] = a[11] * b, out[12] = a[12] * b, out[13] = a[13] * b, out[14] = a[14] * b, out[15] = a[15] * b, out;
    }function multiplyScalarAndAdd(out, a, b, scale) {
      return out[0] = a[0] + b[0] * scale, out[1] = a[1] + b[1] * scale, out[2] = a[2] + b[2] * scale, out[3] = a[3] + b[3] * scale, out[4] = a[4] + b[4] * scale, out[5] = a[5] + b[5] * scale, out[6] = a[6] + b[6] * scale, out[7] = a[7] + b[7] * scale, out[8] = a[8] + b[8] * scale, out[9] = a[9] + b[9] * scale, out[10] = a[10] + b[10] * scale, out[11] = a[11] + b[11] * scale, out[12] = a[12] + b[12] * scale, out[13] = a[13] + b[13] * scale, out[14] = a[14] + b[14] * scale, out[15] = a[15] + b[15] * scale, out;
    }function exactEquals(a, b) {
      return a[0] === b[0] && a[1] === b[1] && a[2] === b[2] && a[3] === b[3] && a[4] === b[4] && a[5] === b[5] && a[6] === b[6] && a[7] === b[7] && a[8] === b[8] && a[9] === b[9] && a[10] === b[10] && a[11] === b[11] && a[12] === b[12] && a[13] === b[13] && a[14] === b[14] && a[15] === b[15];
    }function equals(a, b) {
      var a0 = a[0],
          a1 = a[1],
          a2 = a[2],
          a3 = a[3],
          a4 = a[4],
          a5 = a[5],
          a6 = a[6],
          a7 = a[7],
          a8 = a[8],
          a9 = a[9],
          a10 = a[10],
          a11 = a[11],
          a12 = a[12],
          a13 = a[13],
          a14 = a[14],
          a15 = a[15],
          b0 = b[0],
          b1 = b[1],
          b2 = b[2],
          b3 = b[3],
          b4 = b[4],
          b5 = b[5],
          b6 = b[6],
          b7 = b[7],
          b8 = b[8],
          b9 = b[9],
          b10 = b[10],
          b11 = b[11],
          b12 = b[12],
          b13 = b[13],
          b14 = b[14],
          b15 = b[15];return Math.abs(a0 - b0) <= glMatrix.EPSILON * Math.max(1, Math.abs(a0), Math.abs(b0)) && Math.abs(a1 - b1) <= glMatrix.EPSILON * Math.max(1, Math.abs(a1), Math.abs(b1)) && Math.abs(a2 - b2) <= glMatrix.EPSILON * Math.max(1, Math.abs(a2), Math.abs(b2)) && Math.abs(a3 - b3) <= glMatrix.EPSILON * Math.max(1, Math.abs(a3), Math.abs(b3)) && Math.abs(a4 - b4) <= glMatrix.EPSILON * Math.max(1, Math.abs(a4), Math.abs(b4)) && Math.abs(a5 - b5) <= glMatrix.EPSILON * Math.max(1, Math.abs(a5), Math.abs(b5)) && Math.abs(a6 - b6) <= glMatrix.EPSILON * Math.max(1, Math.abs(a6), Math.abs(b6)) && Math.abs(a7 - b7) <= glMatrix.EPSILON * Math.max(1, Math.abs(a7), Math.abs(b7)) && Math.abs(a8 - b8) <= glMatrix.EPSILON * Math.max(1, Math.abs(a8), Math.abs(b8)) && Math.abs(a9 - b9) <= glMatrix.EPSILON * Math.max(1, Math.abs(a9), Math.abs(b9)) && Math.abs(a10 - b10) <= glMatrix.EPSILON * Math.max(1, Math.abs(a10), Math.abs(b10)) && Math.abs(a11 - b11) <= glMatrix.EPSILON * Math.max(1, Math.abs(a11), Math.abs(b11)) && Math.abs(a12 - b12) <= glMatrix.EPSILON * Math.max(1, Math.abs(a12), Math.abs(b12)) && Math.abs(a13 - b13) <= glMatrix.EPSILON * Math.max(1, Math.abs(a13), Math.abs(b13)) && Math.abs(a14 - b14) <= glMatrix.EPSILON * Math.max(1, Math.abs(a14), Math.abs(b14)) && Math.abs(a15 - b15) <= glMatrix.EPSILON * Math.max(1, Math.abs(a15), Math.abs(b15));
    }Object.defineProperty(exports, "__esModule", { value: !0 }), exports.sub = exports.mul = void 0, exports.create = create, exports.clone = clone, exports.copy = copy, exports.fromValues = fromValues, exports.set = set, exports.identity = identity, exports.transpose = transpose, exports.invert = invert, exports.adjoint = adjoint, exports.determinant = determinant, exports.multiply = multiply, exports.translate = translate, exports.scale = scale, exports.rotate = rotate, exports.rotateX = rotateX, exports.rotateY = rotateY, exports.rotateZ = rotateZ, exports.fromTranslation = fromTranslation, exports.fromScaling = fromScaling, exports.fromRotation = fromRotation, exports.fromXRotation = fromXRotation, exports.fromYRotation = fromYRotation, exports.fromZRotation = fromZRotation, exports.fromRotationTranslation = fromRotationTranslation, exports.fromQuat2 = fromQuat2, exports.getTranslation = getTranslation, exports.getScaling = getScaling, exports.getRotation = getRotation, exports.fromRotationTranslationScale = fromRotationTranslationScale, exports.fromRotationTranslationScaleOrigin = fromRotationTranslationScaleOrigin, exports.fromQuat = fromQuat, exports.frustum = frustum, exports.perspective = perspective, exports.perspectiveFromFieldOfView = perspectiveFromFieldOfView, exports.ortho = ortho, exports.lookAt = lookAt, exports.targetTo = targetTo, exports.str = str, exports.frob = frob, exports.add = add, exports.subtract = subtract, exports.multiplyScalar = multiplyScalar, exports.multiplyScalarAndAdd = multiplyScalarAndAdd, exports.exactEquals = exactEquals, exports.equals = equals;var _common = __webpack_require__(3),
        glMatrix = function (obj) {
      if (obj && obj.__esModule) return obj;var newObj = {};if (null != obj) for (var key in obj) {
        Object.prototype.hasOwnProperty.call(obj, key) && (newObj[key] = obj[key]);
      }return newObj.default = obj, newObj;
    }(_common);exports.mul = multiply, exports.sub = subtract;
  }, function (module, exports, __webpack_require__) {
    "use strict";
    function _interopRequireWildcard(obj) {
      if (obj && obj.__esModule) return obj;var newObj = {};if (null != obj) for (var key in obj) {
        Object.prototype.hasOwnProperty.call(obj, key) && (newObj[key] = obj[key]);
      }return newObj.default = obj, newObj;
    }function create() {
      var out = new glMatrix.ARRAY_TYPE(4);return glMatrix.ARRAY_TYPE != Float32Array && (out[0] = 0, out[1] = 0, out[2] = 0), out[3] = 1, out;
    }function identity(out) {
      return out[0] = 0, out[1] = 0, out[2] = 0, out[3] = 1, out;
    }function setAxisAngle(out, axis, rad) {
      rad *= .5;var s = Math.sin(rad);return out[0] = s * axis[0], out[1] = s * axis[1], out[2] = s * axis[2], out[3] = Math.cos(rad), out;
    }function getAxisAngle(out_axis, q) {
      var rad = 2 * Math.acos(q[3]),
          s = Math.sin(rad / 2);return s > glMatrix.EPSILON ? (out_axis[0] = q[0] / s, out_axis[1] = q[1] / s, out_axis[2] = q[2] / s) : (out_axis[0] = 1, out_axis[1] = 0, out_axis[2] = 0), rad;
    }function multiply(out, a, b) {
      var ax = a[0],
          ay = a[1],
          az = a[2],
          aw = a[3],
          bx = b[0],
          by = b[1],
          bz = b[2],
          bw = b[3];return out[0] = ax * bw + aw * bx + ay * bz - az * by, out[1] = ay * bw + aw * by + az * bx - ax * bz, out[2] = az * bw + aw * bz + ax * by - ay * bx, out[3] = aw * bw - ax * bx - ay * by - az * bz, out;
    }function rotateX(out, a, rad) {
      rad *= .5;var ax = a[0],
          ay = a[1],
          az = a[2],
          aw = a[3],
          bx = Math.sin(rad),
          bw = Math.cos(rad);return out[0] = ax * bw + aw * bx, out[1] = ay * bw + az * bx, out[2] = az * bw - ay * bx, out[3] = aw * bw - ax * bx, out;
    }function rotateY(out, a, rad) {
      rad *= .5;var ax = a[0],
          ay = a[1],
          az = a[2],
          aw = a[3],
          by = Math.sin(rad),
          bw = Math.cos(rad);return out[0] = ax * bw - az * by, out[1] = ay * bw + aw * by, out[2] = az * bw + ax * by, out[3] = aw * bw - ay * by, out;
    }function rotateZ(out, a, rad) {
      rad *= .5;var ax = a[0],
          ay = a[1],
          az = a[2],
          aw = a[3],
          bz = Math.sin(rad),
          bw = Math.cos(rad);return out[0] = ax * bw + ay * bz, out[1] = ay * bw - ax * bz, out[2] = az * bw + aw * bz, out[3] = aw * bw - az * bz, out;
    }function calculateW(out, a) {
      var x = a[0],
          y = a[1],
          z = a[2];return out[0] = x, out[1] = y, out[2] = z, out[3] = Math.sqrt(Math.abs(1 - x * x - y * y - z * z)), out;
    }function slerp(out, a, b, t) {
      var ax = a[0],
          ay = a[1],
          az = a[2],
          aw = a[3],
          bx = b[0],
          by = b[1],
          bz = b[2],
          bw = b[3],
          omega = void 0,
          cosom = void 0,
          sinom = void 0,
          scale0 = void 0,
          scale1 = void 0;return cosom = ax * bx + ay * by + az * bz + aw * bw, cosom < 0 && (cosom = -cosom, bx = -bx, by = -by, bz = -bz, bw = -bw), 1 - cosom > glMatrix.EPSILON ? (omega = Math.acos(cosom), sinom = Math.sin(omega), scale0 = Math.sin((1 - t) * omega) / sinom, scale1 = Math.sin(t * omega) / sinom) : (scale0 = 1 - t, scale1 = t), out[0] = scale0 * ax + scale1 * bx, out[1] = scale0 * ay + scale1 * by, out[2] = scale0 * az + scale1 * bz, out[3] = scale0 * aw + scale1 * bw, out;
    }function random(out) {
      var u1 = glMatrix.RANDOM(),
          u2 = glMatrix.RANDOM(),
          u3 = glMatrix.RANDOM(),
          sqrt1MinusU1 = Math.sqrt(1 - u1),
          sqrtU1 = Math.sqrt(u1);return out[0] = sqrt1MinusU1 * Math.sin(2 * Math.PI * u2), out[1] = sqrt1MinusU1 * Math.cos(2 * Math.PI * u2), out[2] = sqrtU1 * Math.sin(2 * Math.PI * u3), out[3] = sqrtU1 * Math.cos(2 * Math.PI * u3), out;
    }function invert(out, a) {
      var a0 = a[0],
          a1 = a[1],
          a2 = a[2],
          a3 = a[3],
          dot = a0 * a0 + a1 * a1 + a2 * a2 + a3 * a3,
          invDot = dot ? 1 / dot : 0;return out[0] = -a0 * invDot, out[1] = -a1 * invDot, out[2] = -a2 * invDot, out[3] = a3 * invDot, out;
    }function conjugate(out, a) {
      return out[0] = -a[0], out[1] = -a[1], out[2] = -a[2], out[3] = a[3], out;
    }function fromMat3(out, m) {
      var fTrace = m[0] + m[4] + m[8],
          fRoot = void 0;if (fTrace > 0) fRoot = Math.sqrt(fTrace + 1), out[3] = .5 * fRoot, fRoot = .5 / fRoot, out[0] = (m[5] - m[7]) * fRoot, out[1] = (m[6] - m[2]) * fRoot, out[2] = (m[1] - m[3]) * fRoot;else {
        var i = 0;m[4] > m[0] && (i = 1), m[8] > m[3 * i + i] && (i = 2);var j = (i + 1) % 3,
            k = (i + 2) % 3;fRoot = Math.sqrt(m[3 * i + i] - m[3 * j + j] - m[3 * k + k] + 1), out[i] = .5 * fRoot, fRoot = .5 / fRoot, out[3] = (m[3 * j + k] - m[3 * k + j]) * fRoot, out[j] = (m[3 * j + i] + m[3 * i + j]) * fRoot, out[k] = (m[3 * k + i] + m[3 * i + k]) * fRoot;
      }return out;
    }function fromEuler(out, x, y, z) {
      var halfToRad = .5 * Math.PI / 180;x *= halfToRad, y *= halfToRad, z *= halfToRad;var sx = Math.sin(x),
          cx = Math.cos(x),
          sy = Math.sin(y),
          cy = Math.cos(y),
          sz = Math.sin(z),
          cz = Math.cos(z);return out[0] = sx * cy * cz - cx * sy * sz, out[1] = cx * sy * cz + sx * cy * sz, out[2] = cx * cy * sz - sx * sy * cz, out[3] = cx * cy * cz + sx * sy * sz, out;
    }function str(a) {
      return "quat(" + a[0] + ", " + a[1] + ", " + a[2] + ", " + a[3] + ")";
    }Object.defineProperty(exports, "__esModule", { value: !0 }), exports.setAxes = exports.sqlerp = exports.rotationTo = exports.equals = exports.exactEquals = exports.normalize = exports.sqrLen = exports.squaredLength = exports.len = exports.length = exports.lerp = exports.dot = exports.scale = exports.mul = exports.add = exports.set = exports.copy = exports.fromValues = exports.clone = void 0, exports.create = create, exports.identity = identity, exports.setAxisAngle = setAxisAngle, exports.getAxisAngle = getAxisAngle, exports.multiply = multiply, exports.rotateX = rotateX, exports.rotateY = rotateY, exports.rotateZ = rotateZ, exports.calculateW = calculateW, exports.slerp = slerp, exports.random = random, exports.invert = invert, exports.conjugate = conjugate, exports.fromMat3 = fromMat3, exports.fromEuler = fromEuler, exports.str = str;var _common = __webpack_require__(3),
        glMatrix = _interopRequireWildcard(_common),
        _mat = __webpack_require__(17),
        mat3 = _interopRequireWildcard(_mat),
        _vec = __webpack_require__(20),
        vec3 = _interopRequireWildcard(_vec),
        _vec2 = __webpack_require__(21),
        vec4 = _interopRequireWildcard(_vec2),
        length = (exports.clone = vec4.clone, exports.fromValues = vec4.fromValues, exports.copy = vec4.copy, exports.set = vec4.set, exports.add = vec4.add, exports.mul = multiply, exports.scale = vec4.scale, exports.dot = vec4.dot, exports.lerp = vec4.lerp, exports.length = vec4.length),
        squaredLength = (exports.len = length, exports.squaredLength = vec4.squaredLength),
        normalize = (exports.sqrLen = squaredLength, exports.normalize = vec4.normalize);exports.exactEquals = vec4.exactEquals, exports.equals = vec4.equals, exports.rotationTo = function () {
      var tmpvec3 = vec3.create(),
          xUnitVec3 = vec3.fromValues(1, 0, 0),
          yUnitVec3 = vec3.fromValues(0, 1, 0);return function (out, a, b) {
        var dot = vec3.dot(a, b);return dot < -.999999 ? (vec3.cross(tmpvec3, xUnitVec3, a), vec3.len(tmpvec3) < 1e-6 && vec3.cross(tmpvec3, yUnitVec3, a), vec3.normalize(tmpvec3, tmpvec3), setAxisAngle(out, tmpvec3, Math.PI), out) : dot > .999999 ? (out[0] = 0, out[1] = 0, out[2] = 0, out[3] = 1, out) : (vec3.cross(tmpvec3, a, b), out[0] = tmpvec3[0], out[1] = tmpvec3[1], out[2] = tmpvec3[2], out[3] = 1 + dot, normalize(out, out));
      };
    }(), exports.sqlerp = function () {
      var temp1 = create(),
          temp2 = create();return function (out, a, b, c, d, t) {
        return slerp(temp1, a, d, t), slerp(temp2, b, c, t), slerp(out, temp1, temp2, 2 * t * (1 - t)), out;
      };
    }(), exports.setAxes = function () {
      var matr = mat3.create();return function (out, view, right, up) {
        return matr[0] = right[0], matr[3] = right[1], matr[6] = right[2], matr[1] = up[0], matr[4] = up[1], matr[7] = up[2], matr[2] = -view[0], matr[5] = -view[1], matr[8] = -view[2], normalize(out, fromMat3(out, matr));
      };
    }();
  }, function (module, exports, __webpack_require__) {
    "use strict";
    function create() {
      var out = new glMatrix.ARRAY_TYPE(3);return glMatrix.ARRAY_TYPE != Float32Array && (out[0] = 0, out[1] = 0, out[2] = 0), out;
    }function clone(a) {
      var out = new glMatrix.ARRAY_TYPE(3);return out[0] = a[0], out[1] = a[1], out[2] = a[2], out;
    }function length(a) {
      var x = a[0],
          y = a[1],
          z = a[2];return Math.sqrt(x * x + y * y + z * z);
    }function fromValues(x, y, z) {
      var out = new glMatrix.ARRAY_TYPE(3);return out[0] = x, out[1] = y, out[2] = z, out;
    }function copy(out, a) {
      return out[0] = a[0], out[1] = a[1], out[2] = a[2], out;
    }function set(out, x, y, z) {
      return out[0] = x, out[1] = y, out[2] = z, out;
    }function add(out, a, b) {
      return out[0] = a[0] + b[0], out[1] = a[1] + b[1], out[2] = a[2] + b[2], out;
    }function subtract(out, a, b) {
      return out[0] = a[0] - b[0], out[1] = a[1] - b[1], out[2] = a[2] - b[2], out;
    }function multiply(out, a, b) {
      return out[0] = a[0] * b[0], out[1] = a[1] * b[1], out[2] = a[2] * b[2], out;
    }function divide(out, a, b) {
      return out[0] = a[0] / b[0], out[1] = a[1] / b[1], out[2] = a[2] / b[2], out;
    }function ceil(out, a) {
      return out[0] = Math.ceil(a[0]), out[1] = Math.ceil(a[1]), out[2] = Math.ceil(a[2]), out;
    }function floor(out, a) {
      return out[0] = Math.floor(a[0]), out[1] = Math.floor(a[1]), out[2] = Math.floor(a[2]), out;
    }function min(out, a, b) {
      return out[0] = Math.min(a[0], b[0]), out[1] = Math.min(a[1], b[1]), out[2] = Math.min(a[2], b[2]), out;
    }function max(out, a, b) {
      return out[0] = Math.max(a[0], b[0]), out[1] = Math.max(a[1], b[1]), out[2] = Math.max(a[2], b[2]), out;
    }function round(out, a) {
      return out[0] = Math.round(a[0]), out[1] = Math.round(a[1]), out[2] = Math.round(a[2]), out;
    }function scale(out, a, b) {
      return out[0] = a[0] * b, out[1] = a[1] * b, out[2] = a[2] * b, out;
    }function scaleAndAdd(out, a, b, scale) {
      return out[0] = a[0] + b[0] * scale, out[1] = a[1] + b[1] * scale, out[2] = a[2] + b[2] * scale, out;
    }function distance(a, b) {
      var x = b[0] - a[0],
          y = b[1] - a[1],
          z = b[2] - a[2];return Math.sqrt(x * x + y * y + z * z);
    }function squaredDistance(a, b) {
      var x = b[0] - a[0],
          y = b[1] - a[1],
          z = b[2] - a[2];return x * x + y * y + z * z;
    }function squaredLength(a) {
      var x = a[0],
          y = a[1],
          z = a[2];return x * x + y * y + z * z;
    }function negate(out, a) {
      return out[0] = -a[0], out[1] = -a[1], out[2] = -a[2], out;
    }function inverse(out, a) {
      return out[0] = 1 / a[0], out[1] = 1 / a[1], out[2] = 1 / a[2], out;
    }function normalize(out, a) {
      var x = a[0],
          y = a[1],
          z = a[2],
          len = x * x + y * y + z * z;return len > 0 && (len = 1 / Math.sqrt(len), out[0] = a[0] * len, out[1] = a[1] * len, out[2] = a[2] * len), out;
    }function dot(a, b) {
      return a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
    }function cross(out, a, b) {
      var ax = a[0],
          ay = a[1],
          az = a[2],
          bx = b[0],
          by = b[1],
          bz = b[2];return out[0] = ay * bz - az * by, out[1] = az * bx - ax * bz, out[2] = ax * by - ay * bx, out;
    }function lerp(out, a, b, t) {
      var ax = a[0],
          ay = a[1],
          az = a[2];return out[0] = ax + t * (b[0] - ax), out[1] = ay + t * (b[1] - ay), out[2] = az + t * (b[2] - az), out;
    }function hermite(out, a, b, c, d, t) {
      var factorTimes2 = t * t,
          factor1 = factorTimes2 * (2 * t - 3) + 1,
          factor2 = factorTimes2 * (t - 2) + t,
          factor3 = factorTimes2 * (t - 1),
          factor4 = factorTimes2 * (3 - 2 * t);return out[0] = a[0] * factor1 + b[0] * factor2 + c[0] * factor3 + d[0] * factor4, out[1] = a[1] * factor1 + b[1] * factor2 + c[1] * factor3 + d[1] * factor4, out[2] = a[2] * factor1 + b[2] * factor2 + c[2] * factor3 + d[2] * factor4, out;
    }function bezier(out, a, b, c, d, t) {
      var inverseFactor = 1 - t,
          inverseFactorTimesTwo = inverseFactor * inverseFactor,
          factorTimes2 = t * t,
          factor1 = inverseFactorTimesTwo * inverseFactor,
          factor2 = 3 * t * inverseFactorTimesTwo,
          factor3 = 3 * factorTimes2 * inverseFactor,
          factor4 = factorTimes2 * t;return out[0] = a[0] * factor1 + b[0] * factor2 + c[0] * factor3 + d[0] * factor4, out[1] = a[1] * factor1 + b[1] * factor2 + c[1] * factor3 + d[1] * factor4, out[2] = a[2] * factor1 + b[2] * factor2 + c[2] * factor3 + d[2] * factor4, out;
    }function random(out, scale) {
      scale = scale || 1;var r = 2 * glMatrix.RANDOM() * Math.PI,
          z = 2 * glMatrix.RANDOM() - 1,
          zScale = Math.sqrt(1 - z * z) * scale;return out[0] = Math.cos(r) * zScale, out[1] = Math.sin(r) * zScale, out[2] = z * scale, out;
    }function transformMat4(out, a, m) {
      var x = a[0],
          y = a[1],
          z = a[2],
          w = m[3] * x + m[7] * y + m[11] * z + m[15];return w = w || 1, out[0] = (m[0] * x + m[4] * y + m[8] * z + m[12]) / w, out[1] = (m[1] * x + m[5] * y + m[9] * z + m[13]) / w, out[2] = (m[2] * x + m[6] * y + m[10] * z + m[14]) / w, out;
    }function transformMat3(out, a, m) {
      var x = a[0],
          y = a[1],
          z = a[2];return out[0] = x * m[0] + y * m[3] + z * m[6], out[1] = x * m[1] + y * m[4] + z * m[7], out[2] = x * m[2] + y * m[5] + z * m[8], out;
    }function transformQuat(out, a, q) {
      var qx = q[0],
          qy = q[1],
          qz = q[2],
          qw = q[3],
          x = a[0],
          y = a[1],
          z = a[2],
          uvx = qy * z - qz * y,
          uvy = qz * x - qx * z,
          uvz = qx * y - qy * x,
          uuvx = qy * uvz - qz * uvy,
          uuvy = qz * uvx - qx * uvz,
          uuvz = qx * uvy - qy * uvx,
          w2 = 2 * qw;return uvx *= w2, uvy *= w2, uvz *= w2, uuvx *= 2, uuvy *= 2, uuvz *= 2, out[0] = x + uvx + uuvx, out[1] = y + uvy + uuvy, out[2] = z + uvz + uuvz, out;
    }function rotateX(out, a, b, c) {
      var p = [],
          r = [];return p[0] = a[0] - b[0], p[1] = a[1] - b[1], p[2] = a[2] - b[2], r[0] = p[0], r[1] = p[1] * Math.cos(c) - p[2] * Math.sin(c), r[2] = p[1] * Math.sin(c) + p[2] * Math.cos(c), out[0] = r[0] + b[0], out[1] = r[1] + b[1], out[2] = r[2] + b[2], out;
    }function rotateY(out, a, b, c) {
      var p = [],
          r = [];return p[0] = a[0] - b[0], p[1] = a[1] - b[1], p[2] = a[2] - b[2], r[0] = p[2] * Math.sin(c) + p[0] * Math.cos(c), r[1] = p[1], r[2] = p[2] * Math.cos(c) - p[0] * Math.sin(c), out[0] = r[0] + b[0], out[1] = r[1] + b[1], out[2] = r[2] + b[2], out;
    }function rotateZ(out, a, b, c) {
      var p = [],
          r = [];return p[0] = a[0] - b[0], p[1] = a[1] - b[1], p[2] = a[2] - b[2], r[0] = p[0] * Math.cos(c) - p[1] * Math.sin(c), r[1] = p[0] * Math.sin(c) + p[1] * Math.cos(c), r[2] = p[2], out[0] = r[0] + b[0], out[1] = r[1] + b[1], out[2] = r[2] + b[2], out;
    }function angle(a, b) {
      var tempA = fromValues(a[0], a[1], a[2]),
          tempB = fromValues(b[0], b[1], b[2]);normalize(tempA, tempA), normalize(tempB, tempB);var cosine = dot(tempA, tempB);return cosine > 1 ? 0 : cosine < -1 ? Math.PI : Math.acos(cosine);
    }function str(a) {
      return "vec3(" + a[0] + ", " + a[1] + ", " + a[2] + ")";
    }function exactEquals(a, b) {
      return a[0] === b[0] && a[1] === b[1] && a[2] === b[2];
    }function equals(a, b) {
      var a0 = a[0],
          a1 = a[1],
          a2 = a[2],
          b0 = b[0],
          b1 = b[1],
          b2 = b[2];return Math.abs(a0 - b0) <= glMatrix.EPSILON * Math.max(1, Math.abs(a0), Math.abs(b0)) && Math.abs(a1 - b1) <= glMatrix.EPSILON * Math.max(1, Math.abs(a1), Math.abs(b1)) && Math.abs(a2 - b2) <= glMatrix.EPSILON * Math.max(1, Math.abs(a2), Math.abs(b2));
    }Object.defineProperty(exports, "__esModule", { value: !0 }), exports.forEach = exports.sqrLen = exports.len = exports.sqrDist = exports.dist = exports.div = exports.mul = exports.sub = void 0, exports.create = create, exports.clone = clone, exports.length = length, exports.fromValues = fromValues, exports.copy = copy, exports.set = set, exports.add = add, exports.subtract = subtract, exports.multiply = multiply, exports.divide = divide, exports.ceil = ceil, exports.floor = floor, exports.min = min, exports.max = max, exports.round = round, exports.scale = scale, exports.scaleAndAdd = scaleAndAdd, exports.distance = distance, exports.squaredDistance = squaredDistance, exports.squaredLength = squaredLength, exports.negate = negate, exports.inverse = inverse, exports.normalize = normalize, exports.dot = dot, exports.cross = cross, exports.lerp = lerp, exports.hermite = hermite, exports.bezier = bezier, exports.random = random, exports.transformMat4 = transformMat4, exports.transformMat3 = transformMat3, exports.transformQuat = transformQuat, exports.rotateX = rotateX, exports.rotateY = rotateY, exports.rotateZ = rotateZ, exports.angle = angle, exports.str = str, exports.exactEquals = exactEquals, exports.equals = equals;var _common = __webpack_require__(3),
        glMatrix = function (obj) {
      if (obj && obj.__esModule) return obj;var newObj = {};if (null != obj) for (var key in obj) {
        Object.prototype.hasOwnProperty.call(obj, key) && (newObj[key] = obj[key]);
      }return newObj.default = obj, newObj;
    }(_common);exports.sub = subtract, exports.mul = multiply, exports.div = divide, exports.dist = distance, exports.sqrDist = squaredDistance, exports.len = length, exports.sqrLen = squaredLength, exports.forEach = function () {
      var vec = create();return function (a, stride, offset, count, fn, arg) {
        var i = void 0,
            l = void 0;for (stride || (stride = 3), offset || (offset = 0), l = count ? Math.min(count * stride + offset, a.length) : a.length, i = offset; i < l; i += stride) {
          vec[0] = a[i], vec[1] = a[i + 1], vec[2] = a[i + 2], fn(vec, vec, arg), a[i] = vec[0], a[i + 1] = vec[1], a[i + 2] = vec[2];
        }return a;
      };
    }();
  }, function (module, exports, __webpack_require__) {
    "use strict";
    function create() {
      var out = new glMatrix.ARRAY_TYPE(4);return glMatrix.ARRAY_TYPE != Float32Array && (out[0] = 0, out[1] = 0, out[2] = 0, out[3] = 0), out;
    }function clone(a) {
      var out = new glMatrix.ARRAY_TYPE(4);return out[0] = a[0], out[1] = a[1], out[2] = a[2], out[3] = a[3], out;
    }function fromValues(x, y, z, w) {
      var out = new glMatrix.ARRAY_TYPE(4);return out[0] = x, out[1] = y, out[2] = z, out[3] = w, out;
    }function copy(out, a) {
      return out[0] = a[0], out[1] = a[1], out[2] = a[2], out[3] = a[3], out;
    }function set(out, x, y, z, w) {
      return out[0] = x, out[1] = y, out[2] = z, out[3] = w, out;
    }function add(out, a, b) {
      return out[0] = a[0] + b[0], out[1] = a[1] + b[1], out[2] = a[2] + b[2], out[3] = a[3] + b[3], out;
    }function subtract(out, a, b) {
      return out[0] = a[0] - b[0], out[1] = a[1] - b[1], out[2] = a[2] - b[2], out[3] = a[3] - b[3], out;
    }function multiply(out, a, b) {
      return out[0] = a[0] * b[0], out[1] = a[1] * b[1], out[2] = a[2] * b[2], out[3] = a[3] * b[3], out;
    }function divide(out, a, b) {
      return out[0] = a[0] / b[0], out[1] = a[1] / b[1], out[2] = a[2] / b[2], out[3] = a[3] / b[3], out;
    }function ceil(out, a) {
      return out[0] = Math.ceil(a[0]), out[1] = Math.ceil(a[1]), out[2] = Math.ceil(a[2]), out[3] = Math.ceil(a[3]), out;
    }function floor(out, a) {
      return out[0] = Math.floor(a[0]), out[1] = Math.floor(a[1]), out[2] = Math.floor(a[2]), out[3] = Math.floor(a[3]), out;
    }function min(out, a, b) {
      return out[0] = Math.min(a[0], b[0]), out[1] = Math.min(a[1], b[1]), out[2] = Math.min(a[2], b[2]), out[3] = Math.min(a[3], b[3]), out;
    }function max(out, a, b) {
      return out[0] = Math.max(a[0], b[0]), out[1] = Math.max(a[1], b[1]), out[2] = Math.max(a[2], b[2]), out[3] = Math.max(a[3], b[3]), out;
    }function round(out, a) {
      return out[0] = Math.round(a[0]), out[1] = Math.round(a[1]), out[2] = Math.round(a[2]), out[3] = Math.round(a[3]), out;
    }function scale(out, a, b) {
      return out[0] = a[0] * b, out[1] = a[1] * b, out[2] = a[2] * b, out[3] = a[3] * b, out;
    }function scaleAndAdd(out, a, b, scale) {
      return out[0] = a[0] + b[0] * scale, out[1] = a[1] + b[1] * scale, out[2] = a[2] + b[2] * scale, out[3] = a[3] + b[3] * scale, out;
    }function distance(a, b) {
      var x = b[0] - a[0],
          y = b[1] - a[1],
          z = b[2] - a[2],
          w = b[3] - a[3];return Math.sqrt(x * x + y * y + z * z + w * w);
    }function squaredDistance(a, b) {
      var x = b[0] - a[0],
          y = b[1] - a[1],
          z = b[2] - a[2],
          w = b[3] - a[3];return x * x + y * y + z * z + w * w;
    }function length(a) {
      var x = a[0],
          y = a[1],
          z = a[2],
          w = a[3];return Math.sqrt(x * x + y * y + z * z + w * w);
    }function squaredLength(a) {
      var x = a[0],
          y = a[1],
          z = a[2],
          w = a[3];return x * x + y * y + z * z + w * w;
    }function negate(out, a) {
      return out[0] = -a[0], out[1] = -a[1], out[2] = -a[2], out[3] = -a[3], out;
    }function inverse(out, a) {
      return out[0] = 1 / a[0], out[1] = 1 / a[1], out[2] = 1 / a[2], out[3] = 1 / a[3], out;
    }function normalize(out, a) {
      var x = a[0],
          y = a[1],
          z = a[2],
          w = a[3],
          len = x * x + y * y + z * z + w * w;return len > 0 && (len = 1 / Math.sqrt(len), out[0] = x * len, out[1] = y * len, out[2] = z * len, out[3] = w * len), out;
    }function dot(a, b) {
      return a[0] * b[0] + a[1] * b[1] + a[2] * b[2] + a[3] * b[3];
    }function lerp(out, a, b, t) {
      var ax = a[0],
          ay = a[1],
          az = a[2],
          aw = a[3];return out[0] = ax + t * (b[0] - ax), out[1] = ay + t * (b[1] - ay), out[2] = az + t * (b[2] - az), out[3] = aw + t * (b[3] - aw), out;
    }function random(out, scale) {
      scale = scale || 1;var v1, v2, v3, v4, s1, s2;do {
        v1 = 2 * glMatrix.RANDOM() - 1, v2 = 2 * glMatrix.RANDOM() - 1, s1 = v1 * v1 + v2 * v2;
      } while (s1 >= 1);do {
        v3 = 2 * glMatrix.RANDOM() - 1, v4 = 2 * glMatrix.RANDOM() - 1, s2 = v3 * v3 + v4 * v4;
      } while (s2 >= 1);var d = Math.sqrt((1 - s1) / s2);return out[0] = scale * v1, out[1] = scale * v2, out[2] = scale * v3 * d, out[3] = scale * v4 * d, out;
    }function transformMat4(out, a, m) {
      var x = a[0],
          y = a[1],
          z = a[2],
          w = a[3];return out[0] = m[0] * x + m[4] * y + m[8] * z + m[12] * w, out[1] = m[1] * x + m[5] * y + m[9] * z + m[13] * w, out[2] = m[2] * x + m[6] * y + m[10] * z + m[14] * w, out[3] = m[3] * x + m[7] * y + m[11] * z + m[15] * w, out;
    }function transformQuat(out, a, q) {
      var x = a[0],
          y = a[1],
          z = a[2],
          qx = q[0],
          qy = q[1],
          qz = q[2],
          qw = q[3],
          ix = qw * x + qy * z - qz * y,
          iy = qw * y + qz * x - qx * z,
          iz = qw * z + qx * y - qy * x,
          iw = -qx * x - qy * y - qz * z;return out[0] = ix * qw + iw * -qx + iy * -qz - iz * -qy, out[1] = iy * qw + iw * -qy + iz * -qx - ix * -qz, out[2] = iz * qw + iw * -qz + ix * -qy - iy * -qx, out[3] = a[3], out;
    }function str(a) {
      return "vec4(" + a[0] + ", " + a[1] + ", " + a[2] + ", " + a[3] + ")";
    }function exactEquals(a, b) {
      return a[0] === b[0] && a[1] === b[1] && a[2] === b[2] && a[3] === b[3];
    }function equals(a, b) {
      var a0 = a[0],
          a1 = a[1],
          a2 = a[2],
          a3 = a[3],
          b0 = b[0],
          b1 = b[1],
          b2 = b[2],
          b3 = b[3];return Math.abs(a0 - b0) <= glMatrix.EPSILON * Math.max(1, Math.abs(a0), Math.abs(b0)) && Math.abs(a1 - b1) <= glMatrix.EPSILON * Math.max(1, Math.abs(a1), Math.abs(b1)) && Math.abs(a2 - b2) <= glMatrix.EPSILON * Math.max(1, Math.abs(a2), Math.abs(b2)) && Math.abs(a3 - b3) <= glMatrix.EPSILON * Math.max(1, Math.abs(a3), Math.abs(b3));
    }Object.defineProperty(exports, "__esModule", { value: !0 }), exports.forEach = exports.sqrLen = exports.len = exports.sqrDist = exports.dist = exports.div = exports.mul = exports.sub = void 0, exports.create = create, exports.clone = clone, exports.fromValues = fromValues, exports.copy = copy, exports.set = set, exports.add = add, exports.subtract = subtract, exports.multiply = multiply, exports.divide = divide, exports.ceil = ceil, exports.floor = floor, exports.min = min, exports.max = max, exports.round = round, exports.scale = scale, exports.scaleAndAdd = scaleAndAdd, exports.distance = distance, exports.squaredDistance = squaredDistance, exports.length = length, exports.squaredLength = squaredLength, exports.negate = negate, exports.inverse = inverse, exports.normalize = normalize, exports.dot = dot, exports.lerp = lerp, exports.random = random, exports.transformMat4 = transformMat4, exports.transformQuat = transformQuat, exports.str = str, exports.exactEquals = exactEquals, exports.equals = equals;var _common = __webpack_require__(3),
        glMatrix = function (obj) {
      if (obj && obj.__esModule) return obj;var newObj = {};if (null != obj) for (var key in obj) {
        Object.prototype.hasOwnProperty.call(obj, key) && (newObj[key] = obj[key]);
      }return newObj.default = obj, newObj;
    }(_common);exports.sub = subtract, exports.mul = multiply, exports.div = divide, exports.dist = distance, exports.sqrDist = squaredDistance, exports.len = length, exports.sqrLen = squaredLength, exports.forEach = function () {
      var vec = create();return function (a, stride, offset, count, fn, arg) {
        var i = void 0,
            l = void 0;for (stride || (stride = 4), offset || (offset = 0), l = count ? Math.min(count * stride + offset, a.length) : a.length, i = offset; i < l; i += stride) {
          vec[0] = a[i], vec[1] = a[i + 1], vec[2] = a[i + 2], vec[3] = a[i + 3], fn(vec, vec, arg), a[i] = vec[0], a[i + 1] = vec[1], a[i + 2] = vec[2], a[i + 3] = vec[3];
        }return a;
      };
    }();
  }, function (module, exports, __webpack_require__) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: !0 }), exports.default = function (gl, shaderProgram, name) {
      return void 0 === shaderProgram.cacheAttribLoc && (shaderProgram.cacheAttribLoc = {}), void 0 === shaderProgram.cacheAttribLoc[name] && (shaderProgram.cacheAttribLoc[name] = gl.getAttribLocation(shaderProgram, name)), shaderProgram.cacheAttribLoc[name];
    };
  }, function (module, exports, __webpack_require__) {
    "use strict";
    function _interopRequireDefault(obj) {
      return obj && obj.__esModule ? obj : { default: obj };
    }function _classCallCheck(instance, Constructor) {
      if (!(instance instanceof Constructor)) throw new TypeError("Cannot call a class as a function");
    }function isPowerOfTwo(x) {
      return 0 !== x && !(x & x - 1);
    }function getSourceType(mSource) {
      var type = _GLTool2.default.UNSIGNED_BYTE;return mSource instanceof Array ? type = _GLTool2.default.UNSIGNED_BYTE : mSource instanceof Uint8Array ? type = _GLTool2.default.UNSIGNED_BYTE : mSource instanceof Float32Array ? type = _GLTool2.default.FLOAT : mSource instanceof HTMLImageElement ? type = "image" : mSource instanceof HTMLCanvasElement ? type = "canvas" : mSource instanceof HTMLVideoElement && (type = "video"), type;
    }Object.defineProperty(exports, "__esModule", { value: !0 });var _createClass = function () {
      function defineProperties(target, props) {
        for (var i = 0; i < props.length; i++) {
          var descriptor = props[i];descriptor.enumerable = descriptor.enumerable || !1, descriptor.configurable = !0, "value" in descriptor && (descriptor.writable = !0), Object.defineProperty(target, descriptor.key, descriptor);
        }
      }return function (Constructor, protoProps, staticProps) {
        return protoProps && defineProperties(Constructor.prototype, protoProps), staticProps && defineProperties(Constructor, staticProps), Constructor;
      };
    }(),
        _getTextureParameters = __webpack_require__(48),
        _getTextureParameters2 = _interopRequireDefault(_getTextureParameters),
        _WebglNumber = __webpack_require__(7),
        _WebglNumber2 = _interopRequireDefault(_WebglNumber),
        _GLTool = __webpack_require__(0),
        _GLTool2 = _interopRequireDefault(_GLTool),
        _scheduling = __webpack_require__(4),
        _scheduling2 = _interopRequireDefault(_scheduling),
        gl = void 0,
        GLTexture = function () {
      function GLTexture(mSource) {
        var mParam = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : {},
            _this = this,
            mWidth = arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : 0,
            mHeight = arguments.length > 3 && void 0 !== arguments[3] ? arguments[3] : 0;_classCallCheck(this, GLTexture), gl = _GLTool2.default.gl, this._source = mSource, this._getDimension(mSource, mWidth, mHeight), this._sourceType = mParam.type || getSourceType(mSource), this._checkSource(), this._texelType = this._getTexelType(), this._isTextureReady = !0, this._params = (0, _getTextureParameters2.default)(mParam, mSource, this._width, this._height), this._checkMipmap(), this._checkWrapping(), this._texture = gl.createTexture(), "video" === this._sourceType ? (this._isTextureReady = !1, _scheduling2.default.addEF(function () {
          return _this._loop();
        })) : this._uploadTexture();
      }return _createClass(GLTexture, [{ key: "_loop", value: function value() {
          4 === this._source.readyState && (this._isTextureReady = !0, this._uploadTexture());
        } }, { key: "_uploadTexture", value: function value() {
          gl.bindTexture(gl.TEXTURE_2D, this._texture), gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, !0), this._isSourceHtmlElement() ? gl.texImage2D(gl.TEXTURE_2D, 0, this._params.internalFormat, this._params.format, this._texelType, this._source) : gl.texImage2D(gl.TEXTURE_2D, 0, this._params.internalFormat, this._width, this._height, 0, this._params.format, this._texelType, this._source), gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, this._params.magFilter), gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, this._params.minFilter), gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, this._params.wrapS), gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, this._params.wrapT), gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, this._premultiplyAlpha), this._generateMipmap && gl.generateMipmap(gl.TEXTURE_2D), gl.bindTexture(gl.TEXTURE_2D, null);
        } }, { key: "bind", value: function value(index) {
          void 0 === index && (index = 0), _GLTool2.default.shader && (gl.activeTexture(gl.TEXTURE0 + index), this._isTextureReady ? gl.bindTexture(gl.TEXTURE_2D, this._texture) : gl.bindTexture(gl.TEXTURE_2D, GLTexture.blackTexture().texture), this._bindIndex = index);
        } }, { key: "updateTexture", value: function value(mSource) {
          this._source = mSource, this._checkSource(), this._uploadTexture();
        } }, { key: "generateMipmap", value: function value() {
          this._generateMipmap && (gl.bindTexture(gl.TEXTURE_2D, this._texture), gl.generateMipmap(gl.TEXTURE_2D), gl.bindTexture(gl.TEXTURE_2D, null));
        } }, { key: "showParameters", value: function value() {
          console.log("Source type : ", _WebglNumber2.default[this._sourceType] || this._sourceType), console.log("Texel type:", _WebglNumber2.default[this.texelType]), console.log("Dimension :", this._width, this._height);for (var s in this._params) {
            console.log(s, _WebglNumber2.default[this._params[s]] || this._params[s]);
          }console.log("Mipmapping :", this._generateMipmap);
        } }, { key: "_getDimension", value: function value(mSource, mWidth, mHeight) {
          mSource ? (this._width = mSource.width || mSource.videoWidth, this._height = mSource.height || mSource.videoWidth, this._width = this._width || mWidth, this._height = this._height || mHeight, this._width && this._height || (this._width = this._height = Math.sqrt(mSource.length / 4))) : (this._width = mWidth, this._height = mHeight);
        } }, { key: "_checkSource", value: function value() {
          this._source && (this._sourceType === _GLTool2.default.UNSIGNED_BYTE ? this._source instanceof Uint8Array || (this._source = new Uint8Array(this._source)) : this._sourceType === _GLTool2.default.FLOAT && (this._source instanceof Float32Array || (this._source = new Float32Array(this._source))));
        } }, { key: "_getTexelType", value: function value() {
          return this._isSourceHtmlElement() ? _GLTool2.default.UNSIGNED_BYTE : _GLTool2.default[_WebglNumber2.default[this._sourceType]];
        } }, { key: "_checkMipmap", value: function value() {
          this._generateMipmap = this._params.mipmap, isPowerOfTwo(this._width) && isPowerOfTwo(this._height) || (this._generateMipmap = !1), -1 === _WebglNumber2.default[this._params.minFilter].indexOf("MIPMAP") && (this._generateMipmap = !1);
        } }, { key: "_checkWrapping", value: function value() {
          this._generateMipmap || (this._params.wrapS = _GLTool2.default.CLAMP_TO_EDGE, this._params.wrapT = _GLTool2.default.CLAMP_TO_EDGE);
        } }, { key: "_isSourceHtmlElement", value: function value() {
          return "image" === this._sourceType || "video" === this._sourceType || "canvas" === this._sourceType;
        } }, { key: "minFilter", get: function get() {
          return this._params.minFilter;
        }, set: function set(mValue) {
          this._params.minFilter = mValue, this._checkMipmap(), gl.bindTexture(gl.TEXTURE_2D, this._texture), gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, this._params.minFilter), gl.bindTexture(gl.TEXTURE_2D, null), this.generateMipmap();
        } }, { key: "magFilter", get: function get() {
          return this._params.minFilter;
        }, set: function set(mValue) {
          this._params.magFilter = mValue, gl.bindTexture(gl.TEXTURE_2D, this._texture), gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, this._params.magFilter), gl.bindTexture(gl.TEXTURE_2D, null);
        } }, { key: "wrapS", get: function get() {
          return this._params.wrapS;
        }, set: function set(mValue) {
          this._params.wrapS = mValue, this._checkWrapping(), gl.bindTexture(gl.TEXTURE_2D, this._texture), gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, this._params.wrapS), gl.bindTexture(gl.TEXTURE_2D, null);
        } }, { key: "wrapT", get: function get() {
          return this._params.wrapT;
        }, set: function set(mValue) {
          this._params.wrapT = mValue, this._checkWrapping(), gl.bindTexture(gl.TEXTURE_2D, this._texture), gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, this._params.wrapT), gl.bindTexture(gl.TEXTURE_2D, null);
        } }, { key: "texelType", get: function get() {
          return this._texelType;
        } }, { key: "width", get: function get() {
          return this._width;
        } }, { key: "height", get: function get() {
          return this._height;
        } }, { key: "texture", get: function get() {
          return this._texture;
        } }, { key: "isTextureReady", get: function get() {
          return this._isTextureReady;
        } }]), GLTexture;
    }(),
        _whiteTexture = void 0,
        _greyTexture = void 0,
        _blackTexture = void 0;GLTexture.whiteTexture = function () {
      if (void 0 === _whiteTexture) {
        var canvas = document.createElement("canvas");canvas.width = canvas.height = 2;var ctx = canvas.getContext("2d");ctx.fillStyle = "#fff", ctx.fillRect(0, 0, 2, 2), _whiteTexture = new GLTexture(canvas);
      }return _whiteTexture;
    }, GLTexture.greyTexture = function () {
      if (void 0 === _greyTexture) {
        var canvas = document.createElement("canvas");canvas.width = canvas.height = 2;var ctx = canvas.getContext("2d");ctx.fillStyle = "rgb(127, 127, 127)", ctx.fillRect(0, 0, 2, 2), _greyTexture = new GLTexture(canvas);
      }return _greyTexture;
    }, GLTexture.blackTexture = function () {
      if (void 0 === _blackTexture) {
        var canvas = document.createElement("canvas");canvas.width = canvas.height = 2;var ctx = canvas.getContext("2d");ctx.fillStyle = "rgb(0, 0, 0)", ctx.fillRect(0, 0, 2, 2), _blackTexture = new GLTexture(canvas);
      }return _blackTexture;
    }, exports.default = GLTexture;
  }, function (module, exports, __webpack_require__) {
    "use strict";
    function _interopRequireDefault(obj) {
      return obj && obj.__esModule ? obj : { default: obj };
    }function _classCallCheck(instance, Constructor) {
      if (!(instance instanceof Constructor)) throw new TypeError("Cannot call a class as a function");
    }Object.defineProperty(exports, "__esModule", { value: !0 });var _createClass = function () {
      function defineProperties(target, props) {
        for (var i = 0; i < props.length; i++) {
          var descriptor = props[i];descriptor.enumerable = descriptor.enumerable || !1, descriptor.configurable = !0, "value" in descriptor && (descriptor.writable = !0), Object.defineProperty(target, descriptor.key, descriptor);
        }
      }return function (Constructor, protoProps, staticProps) {
        return protoProps && defineProperties(Constructor.prototype, protoProps), staticProps && defineProperties(Constructor, staticProps), Constructor;
      };
    }(),
        _GLTool = __webpack_require__(0),
        _GLTool2 = _interopRequireDefault(_GLTool),
        _parseDds = __webpack_require__(49),
        _parseDds2 = _interopRequireDefault(_parseDds),
        gl = void 0,
        GLCubeTexture = function () {
      function GLCubeTexture(mSource) {
        var mParameters = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : {},
            isCubeTexture = arguments.length > 2 && void 0 !== arguments[2] && arguments[2];if (_classCallCheck(this, GLCubeTexture), gl = _GLTool2.default.gl, isCubeTexture) return void (this.texture = mSource);var hasMipmaps = mSource.length > 6;mSource[0].mipmapCount && (hasMipmaps = mSource[0].mipmapCount > 1), this.texture = gl.createTexture(), this.magFilter = mParameters.magFilter || gl.LINEAR, this.minFilter = mParameters.minFilter || gl.LINEAR_MIPMAP_LINEAR, this.wrapS = mParameters.wrapS || gl.CLAMP_TO_EDGE, this.wrapT = mParameters.wrapT || gl.CLAMP_TO_EDGE, hasMipmaps || this.minFilter != gl.LINEAR_MIPMAP_LINEAR || (this.minFilter = gl.LINEAR), gl.bindTexture(gl.TEXTURE_CUBE_MAP, this.texture);var targets = [gl.TEXTURE_CUBE_MAP_POSITIVE_X, gl.TEXTURE_CUBE_MAP_NEGATIVE_X, gl.TEXTURE_CUBE_MAP_POSITIVE_Y, gl.TEXTURE_CUBE_MAP_NEGATIVE_Y, gl.TEXTURE_CUBE_MAP_POSITIVE_Z, gl.TEXTURE_CUBE_MAP_NEGATIVE_Z],
            numLevels = 1,
            index = 0;if (numLevels = mSource.length / 6, this.numLevels = numLevels, hasMipmaps) for (var j = 0; j < 6; j++) {
          for (var i = 0; i < numLevels; i++) {
            gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, !1), index = j * numLevels + i, mSource[index].shape ? gl.texImage2D(targets[j], i, gl.RGBA, mSource[index].shape[0], mSource[index].shape[1], 0, gl.RGBA, gl.FLOAT, mSource[index].data) : gl.texImage2D(targets[j], i, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, mSource[index]), gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_WRAP_S, this.wrapS), gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_WRAP_T, this.wrapT), gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_MAG_FILTER, this.magFilter), gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_MIN_FILTER, this.minFilter);
          }
        } else {
          for (var _index = 0, _j = 0; _j < 6; _j++) {
            _index = _j * numLevels, gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, !1), mSource[_index].shape ? gl.texImage2D(targets[_j], 0, gl.RGBA, mSource[_index].shape[0], mSource[_index].shape[1], 0, gl.RGBA, gl.FLOAT, mSource[_index].data) : gl.texImage2D(targets[_j], 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, mSource[_index]), gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_WRAP_S, this.wrapS), gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_WRAP_T, this.wrapT), gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_MAG_FILTER, this.magFilter), gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_MIN_FILTER, this.minFilter);
          }gl.generateMipmap(gl.TEXTURE_CUBE_MAP);
        }gl.bindTexture(gl.TEXTURE_CUBE_MAP, null);
      }return _createClass(GLCubeTexture, [{ key: "bind", value: function value() {
          var index = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : 0;_GLTool2.default.shader && (gl.activeTexture(gl.TEXTURE0 + index), gl.bindTexture(gl.TEXTURE_CUBE_MAP, this.texture), gl.uniform1i(_GLTool2.default.shader.uniformTextures[index], index), this._bindIndex = index);
        } }, { key: "unbind", value: function value() {
          gl.bindTexture(gl.TEXTURE_CUBE_MAP, null);
        } }]), GLCubeTexture;
    }();GLCubeTexture.parseDDS = function (mArrayBuffer) {
      var ddsInfos = (0, _parseDds2.default)(mArrayBuffer),
          flags = ddsInfos.flags,
          header = new Int32Array(mArrayBuffer, 0, 31),
          mipmapCount = 1;131072 & flags && (mipmapCount = Math.max(1, header[7]));var sources = ddsInfos.images.map(function (img) {
        return { data: new Float32Array(mArrayBuffer.slice(img.offset, img.offset + img.length)), shape: img.shape, mipmapCount: mipmapCount };
      });return new GLCubeTexture(sources);
    }, exports.default = GLCubeTexture;
  }, function (module, exports, __webpack_require__) {
    "use strict";
    function _interopRequireDefault(obj) {
      return obj && obj.__esModule ? obj : { default: obj };
    }function _classCallCheck(instance, Constructor) {
      if (!(instance instanceof Constructor)) throw new TypeError("Cannot call a class as a function");
    }Object.defineProperty(exports, "__esModule", { value: !0 });var _createClass = function () {
      function defineProperties(target, props) {
        for (var i = 0; i < props.length; i++) {
          var descriptor = props[i];descriptor.enumerable = descriptor.enumerable || !1, descriptor.configurable = !0, "value" in descriptor && (descriptor.writable = !0), Object.defineProperty(target, descriptor.key, descriptor);
        }
      }return function (Constructor, protoProps, staticProps) {
        return protoProps && defineProperties(Constructor.prototype, protoProps), staticProps && defineProperties(Constructor, staticProps), Constructor;
      };
    }(),
        _GLTool = __webpack_require__(0),
        _GLTool2 = _interopRequireDefault(_GLTool),
        _GLTexture = __webpack_require__(23),
        _GLTexture2 = _interopRequireDefault(_GLTexture),
        _WebglNumber = __webpack_require__(7),
        _WebglNumber2 = _interopRequireDefault(_WebglNumber),
        gl = void 0,
        webglDepthTexture = void 0,
        hasCheckedMultiRenderSupport = !1,
        extDrawBuffer = void 0,
        checkMultiRender = function checkMultiRender() {
      return hasCheckedMultiRenderSupport = !0, !!_GLTool2.default.webgl2 || !!(extDrawBuffer = _GLTool2.default.getExtension("WEBGL_draw_buffers"));
    },
        FrameBuffer = function () {
      function FrameBuffer(mWidth, mHeight) {
        var mParameters = arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : {},
            mNumTargets = arguments.length > 3 && void 0 !== arguments[3] ? arguments[3] : 1;_classCallCheck(this, FrameBuffer), gl = _GLTool2.default.gl, webglDepthTexture = (_GLTool2.default.checkExtension("WEBGL_depth_texture") || _GLTool2.default.webgl2) && mNumTargets < 2, this.width = mWidth, this.height = mHeight, this._numTargets = mNumTargets, this._multipleTargets = mNumTargets > 1, this._parameters = mParameters, hasCheckedMultiRenderSupport || checkMultiRender(), this._multipleTargets && this._checkMaxNumRenderTarget(), this._init();
      }return _createClass(FrameBuffer, [{ key: "_init", value: function value() {
          if (this._initTextures(), this.frameBuffer = gl.createFramebuffer(), gl.bindFramebuffer(gl.FRAMEBUFFER, this.frameBuffer), _GLTool2.default.webgl2) {
            for (var buffers = [], i = 0; i < this._numTargets; i++) {
              gl.framebufferTexture2D(gl.DRAW_FRAMEBUFFER, gl.COLOR_ATTACHMENT0 + i, gl.TEXTURE_2D, this._textures[i].texture, 0), buffers.push(gl["COLOR_ATTACHMENT" + i]);
            }gl.drawBuffers(buffers), gl.framebufferTexture2D(gl.DRAW_FRAMEBUFFER, gl.DEPTH_ATTACHMENT, gl.TEXTURE_2D, this.glDepthTexture.texture, 0);
          } else {
            for (var _i = 0; _i < this._numTargets; _i++) {
              gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0 + _i, gl.TEXTURE_2D, this._textures[_i].texture, 0);
            }if (this._multipleTargets) {
              for (var drawBuffers = [], _i2 = 0; _i2 < this._numTargets; _i2++) {
                drawBuffers.push(extDrawBuffer["COLOR_ATTACHMENT" + _i2 + "_WEBGL"]);
              }extDrawBuffer.drawBuffersWEBGL(drawBuffers);
            }webglDepthTexture && gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.DEPTH_ATTACHMENT, gl.TEXTURE_2D, this.glDepthTexture.texture, 0);
          }var FBOstatus = gl.checkFramebufferStatus(gl.FRAMEBUFFER);FBOstatus !== gl.FRAMEBUFFER_COMPLETE && (console.error("FBOstatus", _WebglNumber2.default[FBOstatus], FBOstatus), console.error("GL_FRAMEBUFFER_COMPLETE failed, CANNOT use Framebuffer")), gl.bindTexture(gl.TEXTURE_2D, null), gl.bindRenderbuffer(gl.RENDERBUFFER, null), gl.bindFramebuffer(gl.FRAMEBUFFER, null), this.clear();
        } }, { key: "_checkMaxNumRenderTarget", value: function value() {
          if (_GLTool2.default.webgl2) return _GLTool2.default.gl.getParameter(_GLTool2.default.gl.MAX_DRAW_BUFFERS);var maxNumDrawBuffers = _GLTool2.default.gl.getParameter(extDrawBuffer.MAX_DRAW_BUFFERS_WEBGL);this._numTargets > maxNumDrawBuffers && (console.error("Over max number of draw buffers supported : ", maxNumDrawBuffers), this._numTargets = maxNumDrawBuffers);
        } }, { key: "_initTextures", value: function value() {
          this._textures = [];for (var i = 0; i < this._numTargets; i++) {
            var glt = this._createTexture();this._textures.push(glt);
          }_GLTool2.default.webgl2 ? this.glDepthTexture = this._createTexture(gl.DEPTH_COMPONENT16, gl.UNSIGNED_SHORT, gl.DEPTH_COMPONENT, { minFilter: _GLTool2.default.NEAREST, magFilter: _GLTool2.default.NEAREST, mipmap: !1 }) : this.glDepthTexture = this._createTexture(gl.DEPTH_COMPONENT, gl.UNSIGNED_SHORT, gl.DEPTH_COMPONENT, { minFilter: _GLTool2.default.LINEAR });
        } }, { key: "_createTexture", value: function value(mInternalformat, mTexelType, mFormat) {
          var mParameters = arguments.length > 3 && void 0 !== arguments[3] ? arguments[3] : {},
              parameters = Object.assign({}, this._parameters);mFormat || (mFormat = mInternalformat), parameters.internalFormat = mInternalformat || gl.RGBA, parameters.format = mFormat, parameters.type = parameters.type || mTexelType || _GLTool2.default.UNSIGNED_BYTE, mTexelType === gl.UNSIGNED_SHORT && (parameters.type = mTexelType);for (var s in mParameters) {
            parameters[s] = mParameters[s];
          }return new _GLTexture2.default(null, parameters, this.width, this.height);
        } }, { key: "bind", value: function value() {
          (!(arguments.length > 0 && void 0 !== arguments[0]) || arguments[0]) && _GLTool2.default.viewport(0, 0, this.width, this.height), gl.bindFramebuffer(gl.FRAMEBUFFER, this.frameBuffer);
        } }, { key: "unbind", value: function value() {
          (!(arguments.length > 0 && void 0 !== arguments[0]) || arguments[0]) && _GLTool2.default.viewport(0, 0, _GLTool2.default.width, _GLTool2.default.height), gl.bindFramebuffer(gl.FRAMEBUFFER, null), this._textures.forEach(function (texture) {
            texture.generateMipmap();
          });
        } }, { key: "clear", value: function value() {
          var r = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : 0,
              g = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : 0,
              b = arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : 0,
              a = arguments.length > 3 && void 0 !== arguments[3] ? arguments[3] : 0;this.bind(), _GLTool2.default.clear(r, g, b, a), this.unbind();
        } }, { key: "getTexture", value: function value() {
          var mIndex = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : 0;return this._textures[mIndex];
        } }, { key: "getDepthTexture", value: function value() {
          return this.glDepthTexture;
        } }, { key: "showParameters", value: function value() {
          this._textures[0].showParameters();
        } }, { key: "texture", get: function get() {
          return this._textures[0];
        } }, { key: "depthTexture", get: function get() {
          return this.glDepthTexture;
        } }, { key: "minFilter", get: function get() {
          return this._textures[0].minFilter;
        }, set: function set(mValue) {
          this._textures.forEach(function (texture) {
            texture.minFilter = mValue;
          });
        } }, { key: "magFilter", get: function get() {
          return this._textures[0].magFilter;
        }, set: function set(mValue) {
          this._textures.forEach(function (texture) {
            texture.magFilter = mValue;
          });
        } }, { key: "wrapS", get: function get() {
          return this._textures[0].wrapS;
        }, set: function set(mValue) {
          this._textures.forEach(function (texture) {
            texture.wrapS = mValue;
          });
        } }, { key: "wrapT", get: function get() {
          return this._textures[0].wrapT;
        }, set: function set(mValue) {
          this._textures.forEach(function (texture) {
            texture.wrapT = mValue;
          });
        } }, { key: "numTargets", get: function get() {
          return this._numTargets;
        } }]), FrameBuffer;
    }();exports.default = FrameBuffer;
  }, function (module, exports, __webpack_require__) {
    "use strict";
    function _classCallCheck(instance, Constructor) {
      if (!(instance instanceof Constructor)) throw new TypeError("Cannot call a class as a function");
    }Object.defineProperty(exports, "__esModule", { value: !0 });var _createClass = function () {
      function defineProperties(target, props) {
        for (var i = 0; i < props.length; i++) {
          var descriptor = props[i];descriptor.enumerable = descriptor.enumerable || !1, descriptor.configurable = !0, "value" in descriptor && (descriptor.writable = !0), Object.defineProperty(target, descriptor.key, descriptor);
        }
      }return function (Constructor, protoProps, staticProps) {
        return protoProps && defineProperties(Constructor.prototype, protoProps), staticProps && defineProperties(Constructor, staticProps), Constructor;
      };
    }(),
        supportsCustomEvents = !0;try {
      document.createEvent("CustomEvent");null;
    } catch (e) {
      supportsCustomEvents = !1;
    }var EventDispatcher = function () {
      function EventDispatcher() {
        _classCallCheck(this, EventDispatcher), this._eventListeners = {};
      }return _createClass(EventDispatcher, [{ key: "addEventListener", value: function value(aEventType, aFunction) {
          return null !== this._eventListeners && void 0 !== this._eventListeners || (this._eventListeners = {}), this._eventListeners[aEventType] || (this._eventListeners[aEventType] = []), this._eventListeners[aEventType].push(aFunction), this;
        } }, { key: "on", value: function value(aEventType, aFunction) {
          return this.addEventListener(aEventType, aFunction);
        } }, { key: "removeEventListener", value: function value(aEventType, aFunction) {
          null !== this._eventListeners && void 0 !== this._eventListeners || (this._eventListeners = {});var currentArray = this._eventListeners[aEventType];if (void 0 === currentArray) return this;for (var currentArrayLength = currentArray.length, i = 0; i < currentArrayLength; i++) {
            currentArray[i] === aFunction && (currentArray.splice(i, 1), i--, currentArrayLength--);
          }return this;
        } }, { key: "off", value: function value(aEventType, aFunction) {
          return this.removeEventListener(aEventType, aFunction);
        } }, { key: "dispatchEvent", value: function value(aEvent) {
          null !== this._eventListeners && void 0 !== this._eventListeners || (this._eventListeners = {});var eventType = aEvent.type;try {
            null === aEvent.target && (aEvent.target = this), aEvent.currentTarget = this;
          } catch (theError) {
            var newEvent = { type: eventType, detail: aEvent.detail, dispatcher: this };return this.dispatchEvent(newEvent);
          }var currentEventListeners = this._eventListeners[eventType];if (null !== currentEventListeners && void 0 !== currentEventListeners) for (var currentArray = this._copyArray(currentEventListeners), currentArrayLength = currentArray.length, i = 0; i < currentArrayLength; i++) {
            var currentFunction = currentArray[i];currentFunction.call(this, aEvent);
          }return this;
        } }, { key: "dispatchCustomEvent", value: function value(aEventType, aDetail) {
          var newEvent = void 0;return supportsCustomEvents ? (newEvent = document.createEvent("CustomEvent"), newEvent.dispatcher = this, newEvent.initCustomEvent(aEventType, !1, !1, aDetail)) : newEvent = { type: aEventType, detail: aDetail, dispatcher: this }, this.dispatchEvent(newEvent);
        } }, { key: "trigger", value: function value(aEventType, aDetail) {
          return this.dispatchCustomEvent(aEventType, aDetail);
        } }, { key: "_destroy", value: function value() {
          if (null !== this._eventListeners) {
            for (var objectName in this._eventListeners) {
              if (this._eventListeners.hasOwnProperty(objectName)) {
                for (var currentArray = this._eventListeners[objectName], currentArrayLength = currentArray.length, i = 0; i < currentArrayLength; i++) {
                  currentArray[i] = null;
                }delete this._eventListeners[objectName];
              }
            }this._eventListeners = null;
          }
        } }, { key: "_copyArray", value: function value(aArray) {
          for (var currentArray = new Array(aArray.length), currentArrayLength = currentArray.length, i = 0; i < currentArrayLength; i++) {
            currentArray[i] = aArray[i];
          }return currentArray;
        } }]), EventDispatcher;
    }();exports.default = EventDispatcher;
  }, function (module, exports, __webpack_require__) {
    "use strict";
    function _interopRequireDefault(obj) {
      return obj && obj.__esModule ? obj : { default: obj };
    }function _classCallCheck(instance, Constructor) {
      if (!(instance instanceof Constructor)) throw new TypeError("Cannot call a class as a function");
    }Object.defineProperty(exports, "__esModule", { value: !0 });var _createClass = function () {
      function defineProperties(target, props) {
        for (var i = 0; i < props.length; i++) {
          var descriptor = props[i];descriptor.enumerable = descriptor.enumerable || !1, descriptor.configurable = !0, "value" in descriptor && (descriptor.writable = !0), Object.defineProperty(target, descriptor.key, descriptor);
        }
      }return function (Constructor, protoProps, staticProps) {
        return protoProps && defineProperties(Constructor.prototype, protoProps), staticProps && defineProperties(Constructor, staticProps), Constructor;
      };
    }(),
        _EaseNumber = __webpack_require__(10),
        _EaseNumber2 = _interopRequireDefault(_EaseNumber),
        _scheduling = __webpack_require__(4),
        _scheduling2 = _interopRequireDefault(_scheduling),
        _glMatrix = __webpack_require__(2),
        getMouse = function getMouse(mEvent, mTarget) {
      var o = mTarget || {};return mEvent.touches ? (o.x = mEvent.touches[0].pageX, o.y = mEvent.touches[0].pageY) : (o.x = mEvent.clientX, o.y = mEvent.clientY), o;
    },
        OrbitalControl = function () {
      function OrbitalControl(mTarget) {
        var _this = this,
            mListenerTarget = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : window,
            mRadius = arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : 500;_classCallCheck(this, OrbitalControl), this._target = mTarget, this._listenerTarget = mListenerTarget, this._mouse = {}, this._preMouse = {}, this.center = _glMatrix.vec3.create(), this._up = _glMatrix.vec3.fromValues(0, 1, 0), this.radius = new _EaseNumber2.default(mRadius), this.position = _glMatrix.vec3.fromValues(0, 0, this.radius.value), this.positionOffset = _glMatrix.vec3.create(), this._rx = new _EaseNumber2.default(0), this._rx.limit(-Math.PI / 2, Math.PI / 2), this._ry = new _EaseNumber2.default(0), this._preRX = 0, this._preRY = 0, this._isLockZoom = !1, this._isLockRotation = !1, this._isInvert = !1, this.sensitivity = 1, this._wheelBind = function (e) {
          return _this._onWheel(e);
        }, this._downBind = function (e) {
          return _this._onDown(e);
        }, this._moveBind = function (e) {
          return _this._onMove(e);
        }, this._upBind = function () {
          return _this._onUp();
        }, this.connect(), _scheduling2.default.addEF(function () {
          return _this._loop();
        });
      }return _createClass(OrbitalControl, [{ key: "connect", value: function value() {
          this.disconnect(), this._listenerTarget.addEventListener("mousewheel", this._wheelBind), this._listenerTarget.addEventListener("DOMMouseScroll", this._wheelBind), this._listenerTarget.addEventListener("mousedown", this._downBind), this._listenerTarget.addEventListener("touchstart", this._downBind), this._listenerTarget.addEventListener("mousemove", this._moveBind), this._listenerTarget.addEventListener("touchmove", this._moveBind), window.addEventListener("touchend", this._upBind), window.addEventListener("mouseup", this._upBind);
        } }, { key: "disconnect", value: function value() {
          this._listenerTarget.removeEventListener("mousewheel", this._wheelBind), this._listenerTarget.removeEventListener("DOMMouseScroll", this._wheelBind), this._listenerTarget.removeEventListener("mousedown", this._downBind), this._listenerTarget.removeEventListener("touchstart", this._downBind), this._listenerTarget.removeEventListener("mousemove", this._moveBind), this._listenerTarget.removeEventListener("touchmove", this._moveBind), window.removeEventListener("touchend", this._upBind), window.removeEventListener("mouseup", this._upBind);
        } }, { key: "lock", value: function value() {
          var mValue = !(arguments.length > 0 && void 0 !== arguments[0]) || arguments[0];this._isLockZoom = mValue, this._isLockRotation = mValue, this._isMouseDown = !1;
        } }, { key: "lockZoom", value: function value() {
          var mValue = !(arguments.length > 0 && void 0 !== arguments[0]) || arguments[0];this._isLockZoom = mValue;
        } }, { key: "lockRotation", value: function value() {
          var mValue = !(arguments.length > 0 && void 0 !== arguments[0]) || arguments[0];this._isLockRotation = mValue;
        } }, { key: "inverseControl", value: function value() {
          var isInvert = !(arguments.length > 0 && void 0 !== arguments[0]) || arguments[0];this._isInvert = isInvert;
        } }, { key: "_onDown", value: function value(mEvent) {
          this._isLockRotation || (this._isMouseDown = !0, getMouse(mEvent, this._mouse), getMouse(mEvent, this._preMouse), this._preRX = this._rx.targetValue, this._preRY = this._ry.targetValue);
        } }, { key: "_onMove", value: function value(mEvent) {
          if (!this._isLockRotation && (getMouse(mEvent, this._mouse), mEvent.touches && mEvent.preventDefault(), this._isMouseDown)) {
            var diffX = -(this._mouse.x - this._preMouse.x);this._isInvert && (diffX *= -1), this._ry.value = this._preRY - .01 * diffX * this.sensitivity;var diffY = -(this._mouse.y - this._preMouse.y);this._isInvert && (diffY *= -1), this._rx.value = this._preRX - .01 * diffY * this.sensitivity;
          }
        } }, { key: "_onUp", value: function value() {
          this._isLockRotation || (this._isMouseDown = !1);
        } }, { key: "_onWheel", value: function value(mEvent) {
          if (!this._isLockZoom) {
            var w = mEvent.wheelDelta,
                d = mEvent.detail,
                value = 0;value = d ? w ? w / d / 40 * d > 0 ? 1 : -1 : -d / 3 : w / 120, this.radius.add(2 * -value);
          }
        } }, { key: "_loop", value: function value() {
          this._updatePosition(), this._target && this._updateCamera();
        } }, { key: "_updatePosition", value: function value() {
          this.position[1] = Math.sin(this._rx.value) * this.radius.value;var tr = Math.cos(this._rx.value) * this.radius.value;this.position[0] = Math.cos(this._ry.value + .5 * Math.PI) * tr, this.position[2] = Math.sin(this._ry.value + .5 * Math.PI) * tr, _glMatrix.vec3.add(this.position, this.position, this.positionOffset);
        } }, { key: "_updateCamera", value: function value() {
          this._target.lookAt(this.position, this.center, this._up);
        } }, { key: "rx", get: function get() {
          return this._rx;
        } }, { key: "ry", get: function get() {
          return this._ry;
        } }]), OrbitalControl;
    }();exports.default = OrbitalControl;
  }, function (module, exports, __webpack_require__) {
    "use strict";
    function _classCallCheck(instance, Constructor) {
      if (!(instance instanceof Constructor)) throw new TypeError("Cannot call a class as a function");
    }function _possibleConstructorReturn(self, call) {
      if (!self) throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return !call || "object" != (typeof call === "undefined" ? "undefined" : _typeof2(call)) && "function" != typeof call ? self : call;
    }function _inherits(subClass, superClass) {
      if ("function" != typeof superClass && null !== superClass) throw new TypeError("Super expression must either be null or a function, not " + (typeof superClass === "undefined" ? "undefined" : _typeof2(superClass)));subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: !1, writable: !0, configurable: !0 } }), superClass && (Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass);
    }Object.defineProperty(exports, "__esModule", { value: !0 });var _createClass = function () {
      function defineProperties(target, props) {
        for (var i = 0; i < props.length; i++) {
          var descriptor = props[i];descriptor.enumerable = descriptor.enumerable || !1, descriptor.configurable = !0, "value" in descriptor && (descriptor.writable = !0), Object.defineProperty(target, descriptor.key, descriptor);
        }
      }return function (Constructor, protoProps, staticProps) {
        return protoProps && defineProperties(Constructor.prototype, protoProps), staticProps && defineProperties(Constructor, staticProps), Constructor;
      };
    }(),
        _Camera2 = __webpack_require__(12),
        _Camera3 = function (obj) {
      return obj && obj.__esModule ? obj : { default: obj };
    }(_Camera2),
        _glMatrix = __webpack_require__(2),
        CameraOrtho = function (_Camera) {
      function CameraOrtho() {
        _classCallCheck(this, CameraOrtho);var _this = _possibleConstructorReturn(this, (CameraOrtho.__proto__ || Object.getPrototypeOf(CameraOrtho)).call(this)),
            eye = _glMatrix.vec3.clone([0, 0, 5]),
            center = _glMatrix.vec3.create(),
            up = _glMatrix.vec3.clone([0, 1, 0]);return _this.lookAt(eye, center, up), _this.ortho(-1, 1, 1, -1), _this;
      }return _inherits(CameraOrtho, _Camera), _createClass(CameraOrtho, [{ key: "setBoundary", value: function value(left, right, top, bottom) {
          var near = arguments.length > 4 && void 0 !== arguments[4] ? arguments[4] : .1,
              far = arguments.length > 5 && void 0 !== arguments[5] ? arguments[5] : 100;this.ortho(left, right, top, bottom, near, far);
        } }, { key: "ortho", value: function value(left, right, top, bottom) {
          var near = arguments.length > 4 && void 0 !== arguments[4] ? arguments[4] : .1,
              far = arguments.length > 5 && void 0 !== arguments[5] ? arguments[5] : 100;this.left = left, this.right = right, this.top = top, this.bottom = bottom, mat4.ortho(this._projection, left, right, bottom, top, near, far);
        } }]), CameraOrtho;
    }(_Camera3.default);exports.default = CameraOrtho;
  }, function (module, exports, __webpack_require__) {
    "use strict";
    function _classCallCheck(instance, Constructor) {
      if (!(instance instanceof Constructor)) throw new TypeError("Cannot call a class as a function");
    }Object.defineProperty(exports, "__esModule", { value: !0 });var _createClass = function () {
      function defineProperties(target, props) {
        for (var i = 0; i < props.length; i++) {
          var descriptor = props[i];descriptor.enumerable = descriptor.enumerable || !1, descriptor.configurable = !0, "value" in descriptor && (descriptor.writable = !0), Object.defineProperty(target, descriptor.key, descriptor);
        }
      }return function (Constructor, protoProps, staticProps) {
        return protoProps && defineProperties(Constructor.prototype, protoProps), staticProps && defineProperties(Constructor, staticProps), Constructor;
      };
    }(),
        _glMatrix = __webpack_require__(2),
        _scheduling = __webpack_require__(4),
        _scheduling2 = function (obj) {
      return obj && obj.__esModule ? obj : { default: obj };
    }(_scheduling),
        Object3D = function () {
      function Object3D() {
        _classCallCheck(this, Object3D), this._needUpdate = !0, this._x = 0, this._y = 0, this._z = 0, this._sx = 1, this._sy = 1, this._sz = 1, this._rx = 0, this._ry = 0, this._rz = 0, this._position = _glMatrix.vec3.create(), this._scale = _glMatrix.vec3.fromValues(1, 1, 1), this._rotation = _glMatrix.vec3.create(), this._matrix = _glMatrix.mat4.create(), this._matrixParent = _glMatrix.mat4.create(), this._matrixRotation = _glMatrix.mat4.create(), this._matrixScale = _glMatrix.mat4.create(), this._matrixTranslation = _glMatrix.mat4.create(), this._matrixQuaternion = _glMatrix.mat4.create(), this._quat = _glMatrix.quat.create(), this._children = [];
      }return _createClass(Object3D, [{ key: "addChild", value: function value(mChild) {
          this._children.push(mChild);
        } }, { key: "removeChild", value: function value(mChild) {
          var index = this._children.indexOf(mChild);if (-1 == index) return void console.warn("Child no exist");this._children.splice(index, 1);
        } }, { key: "_update", value: function value() {
          this._needUpdate && (_glMatrix.vec3.set(this._scale, this._sx, this._sy, this._sz), _glMatrix.vec3.set(this._rotation, this._rx, this._ry, this._rz), _glMatrix.vec3.set(this._position, this._x, this._y, this._z), _glMatrix.mat4.identity(this._matrixTranslation, this._matrixTranslation), _glMatrix.mat4.identity(this._matrixScale, this._matrixScale), _glMatrix.mat4.identity(this._matrixRotation, this._matrixRotation), _glMatrix.mat4.rotateX(this._matrixRotation, this._matrixRotation, this._rx), _glMatrix.mat4.rotateY(this._matrixRotation, this._matrixRotation, this._ry), _glMatrix.mat4.rotateZ(this._matrixRotation, this._matrixRotation, this._rz), _glMatrix.mat4.fromQuat(this._matrixQuaternion, this._quat), _glMatrix.mat4.mul(this._matrixRotation, this._matrixQuaternion, this._matrixRotation), _glMatrix.mat4.scale(this._matrixScale, this._matrixScale, this._scale), _glMatrix.mat4.translate(this._matrixTranslation, this._matrixTranslation, this._position), _glMatrix.mat4.mul(this._matrix, this._matrixTranslation, this._matrixRotation), _glMatrix.mat4.mul(this._matrix, this._matrix, this._matrixScale), _glMatrix.mat4.mul(this._matrix, this._matrixParent, this._matrix), this.updateMatrix(), this._needUpdate = !1);
        } }, { key: "updateMatrix", value: function value(mParentMatrix) {
          var _this = this;mParentMatrix && (this._needUpdate = !0, _glMatrix.mat4.copy(this._matrixParent, mParentMatrix)), this._needUpdate && this._children.forEach(function (child) {
            child.updateMatrix(_this._matrix);
          });
        } }, { key: "setRotationFromQuaternion", value: function value(mQuat) {
          var _this2 = this;_glMatrix.quat.copy(this._quat, mQuat), this._needUpdate = !0, _scheduling2.default.next(function () {
            return _this2._update();
          });
        } }, { key: "matrix", get: function get() {
          return this._needUpdate && this._update(), this._matrix;
        } }, { key: "x", get: function get() {
          return this._x;
        }, set: function set(mValue) {
          var _this3 = this;this._needUpdate = !0, this._x = mValue, _scheduling2.default.next(function () {
            return _this3._update();
          });
        } }, { key: "y", get: function get() {
          return this._y;
        }, set: function set(mValue) {
          var _this4 = this;this._needUpdate = !0, this._y = mValue, _scheduling2.default.next(function () {
            return _this4._update();
          });
        } }, { key: "z", get: function get() {
          return this._z;
        }, set: function set(mValue) {
          var _this5 = this;this._needUpdate = !0, this._z = mValue, _scheduling2.default.next(function () {
            return _this5._update();
          });
        } }, { key: "scaleX", get: function get() {
          return this._sx;
        }, set: function set(mValue) {
          var _this6 = this;this._needUpdate = !0, this._sx = mValue, _scheduling2.default.next(function () {
            return _this6._update();
          });
        } }, { key: "scaleY", get: function get() {
          return this._sy;
        }, set: function set(mValue) {
          var _this7 = this;this._needUpdate = !0, this._sy = mValue, _scheduling2.default.next(function () {
            return _this7._update();
          });
        } }, { key: "scaleZ", get: function get() {
          return this._sz;
        }, set: function set(mValue) {
          var _this8 = this;this._needUpdate = !0, this._sz = mValue, _scheduling2.default.next(function () {
            return _this8._update();
          });
        } }, { key: "rotationX", get: function get() {
          return this._rx;
        }, set: function set(mValue) {
          var _this9 = this;this._needUpdate = !0, this._rx = mValue, _scheduling2.default.next(function () {
            return _this9._update();
          });
        } }, { key: "rotationY", get: function get() {
          return this._ry;
        }, set: function set(mValue) {
          var _this10 = this;this._needUpdate = !0, this._ry = mValue, _scheduling2.default.next(function () {
            return _this10._update();
          });
        } }, { key: "rotationZ", get: function get() {
          return this._rz;
        }, set: function set(mValue) {
          var _this11 = this;this._needUpdate = !0, this._rz = mValue, _scheduling2.default.next(function () {
            return _this11._update();
          });
        } }, { key: "children", get: function get() {
          return this._children;
        } }]), Object3D;
    }();exports.default = Object3D;
  }, function (module, exports) {
    module.exports = "// bigTriangle.vert\n\n#define SHADER_NAME BIG_TRIANGLE_VERTEX\n\nprecision mediump float;\n#define GLSLIFY 1\nattribute vec2 aPosition;\nvarying vec2 vTextureCoord;\n\nvoid main(void) {\n    gl_Position = vec4(aPosition, 0.0, 1.0);\n    vTextureCoord = aPosition * .5 + .5;\n}";
  }, function (module, exports) {
    module.exports = "// generalWithNormal.vert\n\n#define SHADER_NAME GENERAL_VERTEX\n\nprecision highp float;\n#define GLSLIFY 1\nattribute vec3 aVertexPosition;\nattribute vec2 aTextureCoord;\nattribute vec3 aNormal;\n\nuniform mat4 uModelMatrix;\nuniform mat4 uViewMatrix;\nuniform mat4 uProjectionMatrix;\nuniform mat3 uNormalMatrix;\n\nuniform vec3 position;\nuniform vec3 scale;\n\nvarying vec2 vTextureCoord;\nvarying vec3 vNormal;\n\nvoid main(void) {\n\tvec3 pos      = aVertexPosition * scale;\n\tpos           += position;\n\tgl_Position   = uProjectionMatrix * uViewMatrix * uModelMatrix * vec4(pos, 1.0);\n\t\n\tvTextureCoord = aTextureCoord;\n\tvNormal       = normalize(uNormalMatrix * aNormal);\n}";
  }, function (module, exports) {
    module.exports = "// basic.vert\n\n#define SHADER_NAME SKYBOX_VERTEX\n\nprecision highp float;\n#define GLSLIFY 1\nattribute vec3 aVertexPosition;\nattribute vec2 aTextureCoord;\nattribute vec3 aNormal;\n\nuniform mat4 uModelMatrix;\nuniform mat4 uViewMatrix;\nuniform mat4 uProjectionMatrix;\n\nvarying vec2 vTextureCoord;\nvarying vec3 vVertex;\nvarying vec3 vNormal;\n\nvoid main(void) {\n\tmat4 matView = uViewMatrix;\n\tmatView[3][0] = 0.0;\n\tmatView[3][1] = 0.0;\n\tmatView[3][2] = 0.0;\n\t\n\tgl_Position = uProjectionMatrix * matView * uModelMatrix * vec4(aVertexPosition, 1.0);\n\tvTextureCoord = aTextureCoord;\n\t\n\tvVertex = aVertexPosition;\n\tvNormal = aNormal;\n}";
  }, function (module, exports) {
    module.exports = "// basic.frag\n\n#define SHADER_NAME SKYBOX_FRAGMENT\n\nprecision mediump float;\n#define GLSLIFY 1\nuniform samplerCube texture;\nvarying vec2 vTextureCoord;\nvarying vec3 vVertex;\n\nvoid main(void) {\n    gl_FragColor = textureCube(texture, vVertex);\n}";
  }, function (module, exports, __webpack_require__) {
    "use strict";
    function _classCallCheck(instance, Constructor) {
      if (!(instance instanceof Constructor)) throw new TypeError("Cannot call a class as a function");
    }Object.defineProperty(exports, "__esModule", { value: !0 });var _createClass = function () {
      function defineProperties(target, props) {
        for (var i = 0; i < props.length; i++) {
          var descriptor = props[i];descriptor.enumerable = descriptor.enumerable || !1, descriptor.configurable = !0, "value" in descriptor && (descriptor.writable = !0), Object.defineProperty(target, descriptor.key, descriptor);
        }
      }return function (Constructor, protoProps, staticProps) {
        return protoProps && defineProperties(Constructor.prototype, protoProps), staticProps && defineProperties(Constructor, staticProps), Constructor;
      };
    }(),
        _FrameBuffer = __webpack_require__(25),
        _FrameBuffer2 = function (obj) {
      return obj && obj.__esModule ? obj : { default: obj };
    }(_FrameBuffer),
        FboArray = function () {
      function FboArray(mNum, width, height) {
        var params = arguments.length > 3 && void 0 !== arguments[3] ? arguments[3] : {},
            mNumTargets = arguments.length > 4 && void 0 !== arguments[4] ? arguments[4] : 1;_classCallCheck(this, FboArray), this._fbos = [];for (var i = 0; i < mNum; i++) {
          var fbo = new _FrameBuffer2.default(width, height, params, mNumTargets);this._fbos.push(fbo);
        }
      }return _createClass(FboArray, [{ key: "swap", value: function value() {
          var a = this._fbos.shift();this._fbos.push(a);
        } }, { key: "read", get: function get() {
          return this._fbos[this._fbos.length - 1];
        } }, { key: "write", get: function get() {
          return this._fbos[0];
        } }, { key: "all", get: function get() {
          return this._fbos;
        } }]), FboArray;
    }();exports.default = FboArray;
  }, function (module, exports, __webpack_require__) {
    "use strict";
    function _interopRequireDefault(obj) {
      return obj && obj.__esModule ? obj : { default: obj };
    }function _classCallCheck(instance, Constructor) {
      if (!(instance instanceof Constructor)) throw new TypeError("Cannot call a class as a function");
    }Object.defineProperty(exports, "__esModule", { value: !0 }), exports.FboPingPong = exports.FboArray = exports.ShaderLibs = exports.Draw = exports.View3D = exports.View = exports.Scene = exports.BatchSky = exports.BatchSkybox = exports.BatchLine = exports.BatchDotsPlane = exports.BatchBall = exports.BatchAxis = exports.BatchCopy = exports.GLTFParser = exports.HDRLoader = exports.ObjLoader = exports.BinaryLoader = exports.Object3D = exports.Ray = exports.CameraCube = exports.CameraPerspective = exports.CameraOrtho = exports.Camera = exports.TouchDetector = exports.QuatRotation = exports.WebglNumber = exports.OrbitalControl = exports.TweenNumber = exports.SpringNumber = exports.EaseNumber = exports.EventDispatcher = exports.Scheduler = exports.TransformFeedbackObject = exports.MultisampleFrameBuffer = exports.CubeFrameBuffer = exports.FrameBuffer = exports.Batch = exports.Geom = exports.Mesh = exports.GLCubeTexture = exports.GLTexture = exports.GLShader = exports.GL = void 0;var _createClass = function () {
      function defineProperties(target, props) {
        for (var i = 0; i < props.length; i++) {
          var descriptor = props[i];descriptor.enumerable = descriptor.enumerable || !1, descriptor.configurable = !0, "value" in descriptor && (descriptor.writable = !0), Object.defineProperty(target, descriptor.key, descriptor);
        }
      }return function (Constructor, protoProps, staticProps) {
        return protoProps && defineProperties(Constructor.prototype, protoProps), staticProps && defineProperties(Constructor, staticProps), Constructor;
      };
    }(),
        _glMatrix = __webpack_require__(2),
        GLM = function (obj) {
      if (obj && obj.__esModule) return obj;var newObj = {};if (null != obj) for (var key in obj) {
        Object.prototype.hasOwnProperty.call(obj, key) && (newObj[key] = obj[key]);
      }return newObj.default = obj, newObj;
    }(_glMatrix),
        _GLTool = __webpack_require__(0),
        _GLTool2 = _interopRequireDefault(_GLTool),
        _GLShader = __webpack_require__(1),
        _GLShader2 = _interopRequireDefault(_GLShader),
        _GLTexture = __webpack_require__(23),
        _GLTexture2 = _interopRequireDefault(_GLTexture),
        _GLCubeTexture = __webpack_require__(24),
        _GLCubeTexture2 = _interopRequireDefault(_GLCubeTexture),
        _Mesh = __webpack_require__(5),
        _Mesh2 = _interopRequireDefault(_Mesh),
        _Geom = __webpack_require__(8),
        _Geom2 = _interopRequireDefault(_Geom),
        _Batch = __webpack_require__(6),
        _Batch2 = _interopRequireDefault(_Batch),
        _FrameBuffer = __webpack_require__(25),
        _FrameBuffer2 = _interopRequireDefault(_FrameBuffer),
        _CubeFrameBuffer = __webpack_require__(50),
        _CubeFrameBuffer2 = _interopRequireDefault(_CubeFrameBuffer),
        _MultisampleFrameBuffer = __webpack_require__(51),
        _MultisampleFrameBuffer2 = _interopRequireDefault(_MultisampleFrameBuffer),
        _TransformFeedbackObject = __webpack_require__(53),
        _TransformFeedbackObject2 = _interopRequireDefault(_TransformFeedbackObject),
        _scheduling = __webpack_require__(4),
        _scheduling2 = _interopRequireDefault(_scheduling),
        _EventDispatcher = __webpack_require__(26),
        _EventDispatcher2 = _interopRequireDefault(_EventDispatcher),
        _EaseNumber = __webpack_require__(10),
        _EaseNumber2 = _interopRequireDefault(_EaseNumber),
        _SpringNumber = __webpack_require__(54),
        _SpringNumber2 = _interopRequireDefault(_SpringNumber),
        _TweenNumber = __webpack_require__(55),
        _TweenNumber2 = _interopRequireDefault(_TweenNumber),
        _OrbitalControl = __webpack_require__(27),
        _OrbitalControl2 = _interopRequireDefault(_OrbitalControl),
        _QuatRotation = __webpack_require__(56),
        _QuatRotation2 = _interopRequireDefault(_QuatRotation),
        _TouchDetector = __webpack_require__(57),
        _TouchDetector2 = _interopRequireDefault(_TouchDetector),
        _WebglNumber = __webpack_require__(7),
        _WebglNumber2 = _interopRequireDefault(_WebglNumber),
        _Camera = __webpack_require__(12),
        _Camera2 = _interopRequireDefault(_Camera),
        _CameraOrtho = __webpack_require__(28),
        _CameraOrtho2 = _interopRequireDefault(_CameraOrtho),
        _CameraPerspective = __webpack_require__(13),
        _CameraPerspective2 = _interopRequireDefault(_CameraPerspective),
        _CameraCube = __webpack_require__(59),
        _CameraCube2 = _interopRequireDefault(_CameraCube),
        _Ray = __webpack_require__(11),
        _Ray2 = _interopRequireDefault(_Ray),
        _Object3D = __webpack_require__(29),
        _Object3D2 = _interopRequireDefault(_Object3D),
        _BinaryLoader = __webpack_require__(14),
        _BinaryLoader2 = _interopRequireDefault(_BinaryLoader),
        _ObjLoader = __webpack_require__(60),
        _ObjLoader2 = _interopRequireDefault(_ObjLoader),
        _HDRLoader = __webpack_require__(61),
        _HDRLoader2 = _interopRequireDefault(_HDRLoader),
        _GLTFParser = __webpack_require__(63),
        _GLTFParser2 = _interopRequireDefault(_GLTFParser),
        _BatchCopy = __webpack_require__(64),
        _BatchCopy2 = _interopRequireDefault(_BatchCopy),
        _BatchAxis = __webpack_require__(65),
        _BatchAxis2 = _interopRequireDefault(_BatchAxis),
        _BatchBall = __webpack_require__(68),
        _BatchBall2 = _interopRequireDefault(_BatchBall),
        _BatchDotsPlane = __webpack_require__(69),
        _BatchDotsPlane2 = _interopRequireDefault(_BatchDotsPlane),
        _BatchLine = __webpack_require__(72),
        _BatchLine2 = _interopRequireDefault(_BatchLine),
        _BatchSkybox = __webpack_require__(73),
        _BatchSkybox2 = _interopRequireDefault(_BatchSkybox),
        _BatchSky = __webpack_require__(74),
        _BatchSky2 = _interopRequireDefault(_BatchSky),
        _Scene = __webpack_require__(76),
        _Scene2 = _interopRequireDefault(_Scene),
        _View = __webpack_require__(77),
        _View2 = _interopRequireDefault(_View),
        _View3D = __webpack_require__(78),
        _View3D2 = _interopRequireDefault(_View3D),
        _Draw = __webpack_require__(79),
        _Draw2 = _interopRequireDefault(_Draw),
        _ShaderLibs = __webpack_require__(80),
        _ShaderLibs2 = _interopRequireDefault(_ShaderLibs),
        _FboArray = __webpack_require__(34),
        _FboArray2 = _interopRequireDefault(_FboArray),
        _FboPingPong = __webpack_require__(81),
        _FboPingPong2 = _interopRequireDefault(_FboPingPong),
        Alfrid = function () {
      function Alfrid() {
        _classCallCheck(this, Alfrid), this.glm = GLM, this.GL = _GLTool2.default, this.GLTool = _GLTool2.default, this.GLShader = _GLShader2.default, this.GLTexture = _GLTexture2.default, this.GLCubeTexture = _GLCubeTexture2.default, this.Mesh = _Mesh2.default, this.Geom = _Geom2.default, this.Batch = _Batch2.default, this.FrameBuffer = _FrameBuffer2.default, this.CubeFrameBuffer = _CubeFrameBuffer2.default, this.Scheduler = _scheduling2.default, this.EventDispatcher = _EventDispatcher2.default, this.EaseNumber = _EaseNumber2.default, this.SpringNumber = _SpringNumber2.default, this.TweenNumber = _TweenNumber2.default, this.Camera = _Camera2.default, this.CameraOrtho = _CameraOrtho2.default, this.CameraPerspective = _CameraPerspective2.default, this.Ray = _Ray2.default, this.CameraCube = _CameraCube2.default, this.OrbitalControl = _OrbitalControl2.default, this.QuatRotation = _QuatRotation2.default, this.BinaryLoader = _BinaryLoader2.default, this.ObjLoader = _ObjLoader2.default, this.GLTFParser = _GLTFParser2.default, this.HDRLoader = _HDRLoader2.default, this.BatchCopy = _BatchCopy2.default, this.BatchAxis = _BatchAxis2.default, this.BatchBall = _BatchBall2.default, this.BatchBall = _BatchBall2.default, this.BatchLine = _BatchLine2.default, this.BatchSkybox = _BatchSkybox2.default, this.BatchSky = _BatchSky2.default, this.BatchDotsPlane = _BatchDotsPlane2.default, this.Scene = _Scene2.default, this.View = _View2.default, this.View3D = _View3D2.default, this.Draw = _Draw2.default, this.Object3D = _Object3D2.default, this.ShaderLibs = _ShaderLibs2.default, this.WebglNumber = _WebglNumber2.default, this.FboArray = _FboArray2.default, this.FboPingPong = _FboPingPong2.default, this.MultisampleFrameBuffer = _MultisampleFrameBuffer2.default, this.TransformFeedbackObject = _TransformFeedbackObject2.default;for (var s in GLM) {
          GLM[s] && (window[s] = GLM[s]);
        }
      }return _createClass(Alfrid, [{ key: "log", value: function value() {
          navigator.userAgent.indexOf("Chrome") > -1 ? console.log("%clib alfrid : VERSION 0.3.9", "background: #193441; color: #FCFFF5") : console.log("lib alfrid : VERSION ", "0.3.9"), console.log("%cClasses : ", "color: #193441");for (var s in this) {
            this[s] && console.log("%c - " + s, "color: #3E606F");
          }
        } }]), Alfrid;
    }(),
        al = new Alfrid();exports.default = al, exports.GL = _GLTool2.default, exports.GLShader = _GLShader2.default, exports.GLTexture = _GLTexture2.default, exports.GLCubeTexture = _GLCubeTexture2.default, exports.Mesh = _Mesh2.default, exports.Geom = _Geom2.default, exports.Batch = _Batch2.default, exports.FrameBuffer = _FrameBuffer2.default, exports.CubeFrameBuffer = _CubeFrameBuffer2.default, exports.MultisampleFrameBuffer = _MultisampleFrameBuffer2.default, exports.TransformFeedbackObject = _TransformFeedbackObject2.default, exports.Scheduler = _scheduling2.default, exports.EventDispatcher = _EventDispatcher2.default, exports.EaseNumber = _EaseNumber2.default, exports.SpringNumber = _SpringNumber2.default, exports.TweenNumber = _TweenNumber2.default, exports.OrbitalControl = _OrbitalControl2.default, exports.WebglNumber = _WebglNumber2.default, exports.QuatRotation = _QuatRotation2.default, exports.TouchDetector = _TouchDetector2.default, exports.Camera = _Camera2.default, exports.CameraOrtho = _CameraOrtho2.default, exports.CameraPerspective = _CameraPerspective2.default, exports.CameraCube = _CameraCube2.default, exports.Ray = _Ray2.default, exports.Object3D = _Object3D2.default, exports.BinaryLoader = _BinaryLoader2.default, exports.ObjLoader = _ObjLoader2.default, exports.HDRLoader = _HDRLoader2.default, exports.GLTFParser = _GLTFParser2.default, exports.BatchCopy = _BatchCopy2.default, exports.BatchAxis = _BatchAxis2.default, exports.BatchBall = _BatchBall2.default, exports.BatchDotsPlane = _BatchDotsPlane2.default, exports.BatchLine = _BatchLine2.default, exports.BatchSkybox = _BatchSkybox2.default, exports.BatchSky = _BatchSky2.default, exports.Scene = _Scene2.default, exports.View = _View2.default, exports.View3D = _View3D2.default, exports.Draw = _Draw2.default, exports.ShaderLibs = _ShaderLibs2.default, exports.FboArray = _FboArray2.default, exports.FboPingPong = _FboPingPong2.default;
  }, function (module, exports, __webpack_require__) {
    "use strict";
    function create() {
      var out = new glMatrix.ARRAY_TYPE(4);return glMatrix.ARRAY_TYPE != Float32Array && (out[1] = 0, out[2] = 0), out[0] = 1, out[3] = 1, out;
    }function clone(a) {
      var out = new glMatrix.ARRAY_TYPE(4);return out[0] = a[0], out[1] = a[1], out[2] = a[2], out[3] = a[3], out;
    }function copy(out, a) {
      return out[0] = a[0], out[1] = a[1], out[2] = a[2], out[3] = a[3], out;
    }function identity(out) {
      return out[0] = 1, out[1] = 0, out[2] = 0, out[3] = 1, out;
    }function fromValues(m00, m01, m10, m11) {
      var out = new glMatrix.ARRAY_TYPE(4);return out[0] = m00, out[1] = m01, out[2] = m10, out[3] = m11, out;
    }function set(out, m00, m01, m10, m11) {
      return out[0] = m00, out[1] = m01, out[2] = m10, out[3] = m11, out;
    }function transpose(out, a) {
      if (out === a) {
        var a1 = a[1];out[1] = a[2], out[2] = a1;
      } else out[0] = a[0], out[1] = a[2], out[2] = a[1], out[3] = a[3];return out;
    }function invert(out, a) {
      var a0 = a[0],
          a1 = a[1],
          a2 = a[2],
          a3 = a[3],
          det = a0 * a3 - a2 * a1;return det ? (det = 1 / det, out[0] = a3 * det, out[1] = -a1 * det, out[2] = -a2 * det, out[3] = a0 * det, out) : null;
    }function adjoint(out, a) {
      var a0 = a[0];return out[0] = a[3], out[1] = -a[1], out[2] = -a[2], out[3] = a0, out;
    }function determinant(a) {
      return a[0] * a[3] - a[2] * a[1];
    }function multiply(out, a, b) {
      var a0 = a[0],
          a1 = a[1],
          a2 = a[2],
          a3 = a[3],
          b0 = b[0],
          b1 = b[1],
          b2 = b[2],
          b3 = b[3];return out[0] = a0 * b0 + a2 * b1, out[1] = a1 * b0 + a3 * b1, out[2] = a0 * b2 + a2 * b3, out[3] = a1 * b2 + a3 * b3, out;
    }function rotate(out, a, rad) {
      var a0 = a[0],
          a1 = a[1],
          a2 = a[2],
          a3 = a[3],
          s = Math.sin(rad),
          c = Math.cos(rad);return out[0] = a0 * c + a2 * s, out[1] = a1 * c + a3 * s, out[2] = a0 * -s + a2 * c, out[3] = a1 * -s + a3 * c, out;
    }function scale(out, a, v) {
      var a0 = a[0],
          a1 = a[1],
          a2 = a[2],
          a3 = a[3],
          v0 = v[0],
          v1 = v[1];return out[0] = a0 * v0, out[1] = a1 * v0, out[2] = a2 * v1, out[3] = a3 * v1, out;
    }function fromRotation(out, rad) {
      var s = Math.sin(rad),
          c = Math.cos(rad);return out[0] = c, out[1] = s, out[2] = -s, out[3] = c, out;
    }function fromScaling(out, v) {
      return out[0] = v[0], out[1] = 0, out[2] = 0, out[3] = v[1], out;
    }function str(a) {
      return "mat2(" + a[0] + ", " + a[1] + ", " + a[2] + ", " + a[3] + ")";
    }function frob(a) {
      return Math.sqrt(Math.pow(a[0], 2) + Math.pow(a[1], 2) + Math.pow(a[2], 2) + Math.pow(a[3], 2));
    }function LDU(L, D, U, a) {
      return L[2] = a[2] / a[0], U[0] = a[0], U[1] = a[1], U[3] = a[3] - L[2] * U[1], [L, D, U];
    }function add(out, a, b) {
      return out[0] = a[0] + b[0], out[1] = a[1] + b[1], out[2] = a[2] + b[2], out[3] = a[3] + b[3], out;
    }function subtract(out, a, b) {
      return out[0] = a[0] - b[0], out[1] = a[1] - b[1], out[2] = a[2] - b[2], out[3] = a[3] - b[3], out;
    }function exactEquals(a, b) {
      return a[0] === b[0] && a[1] === b[1] && a[2] === b[2] && a[3] === b[3];
    }function equals(a, b) {
      var a0 = a[0],
          a1 = a[1],
          a2 = a[2],
          a3 = a[3],
          b0 = b[0],
          b1 = b[1],
          b2 = b[2],
          b3 = b[3];return Math.abs(a0 - b0) <= glMatrix.EPSILON * Math.max(1, Math.abs(a0), Math.abs(b0)) && Math.abs(a1 - b1) <= glMatrix.EPSILON * Math.max(1, Math.abs(a1), Math.abs(b1)) && Math.abs(a2 - b2) <= glMatrix.EPSILON * Math.max(1, Math.abs(a2), Math.abs(b2)) && Math.abs(a3 - b3) <= glMatrix.EPSILON * Math.max(1, Math.abs(a3), Math.abs(b3));
    }function multiplyScalar(out, a, b) {
      return out[0] = a[0] * b, out[1] = a[1] * b, out[2] = a[2] * b, out[3] = a[3] * b, out;
    }function multiplyScalarAndAdd(out, a, b, scale) {
      return out[0] = a[0] + b[0] * scale, out[1] = a[1] + b[1] * scale, out[2] = a[2] + b[2] * scale, out[3] = a[3] + b[3] * scale, out;
    }Object.defineProperty(exports, "__esModule", { value: !0 }), exports.sub = exports.mul = void 0, exports.create = create, exports.clone = clone, exports.copy = copy, exports.identity = identity, exports.fromValues = fromValues, exports.set = set, exports.transpose = transpose, exports.invert = invert, exports.adjoint = adjoint, exports.determinant = determinant, exports.multiply = multiply, exports.rotate = rotate, exports.scale = scale, exports.fromRotation = fromRotation, exports.fromScaling = fromScaling, exports.str = str, exports.frob = frob, exports.LDU = LDU, exports.add = add, exports.subtract = subtract, exports.exactEquals = exactEquals, exports.equals = equals, exports.multiplyScalar = multiplyScalar, exports.multiplyScalarAndAdd = multiplyScalarAndAdd;var _common = __webpack_require__(3),
        glMatrix = function (obj) {
      if (obj && obj.__esModule) return obj;var newObj = {};if (null != obj) for (var key in obj) {
        Object.prototype.hasOwnProperty.call(obj, key) && (newObj[key] = obj[key]);
      }return newObj.default = obj, newObj;
    }(_common);exports.mul = multiply, exports.sub = subtract;
  }, function (module, exports, __webpack_require__) {
    "use strict";
    function create() {
      var out = new glMatrix.ARRAY_TYPE(6);return glMatrix.ARRAY_TYPE != Float32Array && (out[1] = 0, out[2] = 0, out[4] = 0, out[5] = 0), out[0] = 1, out[3] = 1, out;
    }function clone(a) {
      var out = new glMatrix.ARRAY_TYPE(6);return out[0] = a[0], out[1] = a[1], out[2] = a[2], out[3] = a[3], out[4] = a[4], out[5] = a[5], out;
    }function copy(out, a) {
      return out[0] = a[0], out[1] = a[1], out[2] = a[2], out[3] = a[3], out[4] = a[4], out[5] = a[5], out;
    }function identity(out) {
      return out[0] = 1, out[1] = 0, out[2] = 0, out[3] = 1, out[4] = 0, out[5] = 0, out;
    }function fromValues(a, b, c, d, tx, ty) {
      var out = new glMatrix.ARRAY_TYPE(6);return out[0] = a, out[1] = b, out[2] = c, out[3] = d, out[4] = tx, out[5] = ty, out;
    }function set(out, a, b, c, d, tx, ty) {
      return out[0] = a, out[1] = b, out[2] = c, out[3] = d, out[4] = tx, out[5] = ty, out;
    }function invert(out, a) {
      var aa = a[0],
          ab = a[1],
          ac = a[2],
          ad = a[3],
          atx = a[4],
          aty = a[5],
          det = aa * ad - ab * ac;return det ? (det = 1 / det, out[0] = ad * det, out[1] = -ab * det, out[2] = -ac * det, out[3] = aa * det, out[4] = (ac * aty - ad * atx) * det, out[5] = (ab * atx - aa * aty) * det, out) : null;
    }function determinant(a) {
      return a[0] * a[3] - a[1] * a[2];
    }function multiply(out, a, b) {
      var a0 = a[0],
          a1 = a[1],
          a2 = a[2],
          a3 = a[3],
          a4 = a[4],
          a5 = a[5],
          b0 = b[0],
          b1 = b[1],
          b2 = b[2],
          b3 = b[3],
          b4 = b[4],
          b5 = b[5];return out[0] = a0 * b0 + a2 * b1, out[1] = a1 * b0 + a3 * b1, out[2] = a0 * b2 + a2 * b3, out[3] = a1 * b2 + a3 * b3, out[4] = a0 * b4 + a2 * b5 + a4, out[5] = a1 * b4 + a3 * b5 + a5, out;
    }function rotate(out, a, rad) {
      var a0 = a[0],
          a1 = a[1],
          a2 = a[2],
          a3 = a[3],
          a4 = a[4],
          a5 = a[5],
          s = Math.sin(rad),
          c = Math.cos(rad);return out[0] = a0 * c + a2 * s, out[1] = a1 * c + a3 * s, out[2] = a0 * -s + a2 * c, out[3] = a1 * -s + a3 * c, out[4] = a4, out[5] = a5, out;
    }function scale(out, a, v) {
      var a0 = a[0],
          a1 = a[1],
          a2 = a[2],
          a3 = a[3],
          a4 = a[4],
          a5 = a[5],
          v0 = v[0],
          v1 = v[1];return out[0] = a0 * v0, out[1] = a1 * v0, out[2] = a2 * v1, out[3] = a3 * v1, out[4] = a4, out[5] = a5, out;
    }function translate(out, a, v) {
      var a0 = a[0],
          a1 = a[1],
          a2 = a[2],
          a3 = a[3],
          a4 = a[4],
          a5 = a[5],
          v0 = v[0],
          v1 = v[1];return out[0] = a0, out[1] = a1, out[2] = a2, out[3] = a3, out[4] = a0 * v0 + a2 * v1 + a4, out[5] = a1 * v0 + a3 * v1 + a5, out;
    }function fromRotation(out, rad) {
      var s = Math.sin(rad),
          c = Math.cos(rad);return out[0] = c, out[1] = s, out[2] = -s, out[3] = c, out[4] = 0, out[5] = 0, out;
    }function fromScaling(out, v) {
      return out[0] = v[0], out[1] = 0, out[2] = 0, out[3] = v[1], out[4] = 0, out[5] = 0, out;
    }function fromTranslation(out, v) {
      return out[0] = 1, out[1] = 0, out[2] = 0, out[3] = 1, out[4] = v[0], out[5] = v[1], out;
    }function str(a) {
      return "mat2d(" + a[0] + ", " + a[1] + ", " + a[2] + ", " + a[3] + ", " + a[4] + ", " + a[5] + ")";
    }function frob(a) {
      return Math.sqrt(Math.pow(a[0], 2) + Math.pow(a[1], 2) + Math.pow(a[2], 2) + Math.pow(a[3], 2) + Math.pow(a[4], 2) + Math.pow(a[5], 2) + 1);
    }function add(out, a, b) {
      return out[0] = a[0] + b[0], out[1] = a[1] + b[1], out[2] = a[2] + b[2], out[3] = a[3] + b[3], out[4] = a[4] + b[4], out[5] = a[5] + b[5], out;
    }function subtract(out, a, b) {
      return out[0] = a[0] - b[0], out[1] = a[1] - b[1], out[2] = a[2] - b[2], out[3] = a[3] - b[3], out[4] = a[4] - b[4], out[5] = a[5] - b[5], out;
    }function multiplyScalar(out, a, b) {
      return out[0] = a[0] * b, out[1] = a[1] * b, out[2] = a[2] * b, out[3] = a[3] * b, out[4] = a[4] * b, out[5] = a[5] * b, out;
    }function multiplyScalarAndAdd(out, a, b, scale) {
      return out[0] = a[0] + b[0] * scale, out[1] = a[1] + b[1] * scale, out[2] = a[2] + b[2] * scale, out[3] = a[3] + b[3] * scale, out[4] = a[4] + b[4] * scale, out[5] = a[5] + b[5] * scale, out;
    }function exactEquals(a, b) {
      return a[0] === b[0] && a[1] === b[1] && a[2] === b[2] && a[3] === b[3] && a[4] === b[4] && a[5] === b[5];
    }function equals(a, b) {
      var a0 = a[0],
          a1 = a[1],
          a2 = a[2],
          a3 = a[3],
          a4 = a[4],
          a5 = a[5],
          b0 = b[0],
          b1 = b[1],
          b2 = b[2],
          b3 = b[3],
          b4 = b[4],
          b5 = b[5];return Math.abs(a0 - b0) <= glMatrix.EPSILON * Math.max(1, Math.abs(a0), Math.abs(b0)) && Math.abs(a1 - b1) <= glMatrix.EPSILON * Math.max(1, Math.abs(a1), Math.abs(b1)) && Math.abs(a2 - b2) <= glMatrix.EPSILON * Math.max(1, Math.abs(a2), Math.abs(b2)) && Math.abs(a3 - b3) <= glMatrix.EPSILON * Math.max(1, Math.abs(a3), Math.abs(b3)) && Math.abs(a4 - b4) <= glMatrix.EPSILON * Math.max(1, Math.abs(a4), Math.abs(b4)) && Math.abs(a5 - b5) <= glMatrix.EPSILON * Math.max(1, Math.abs(a5), Math.abs(b5));
    }Object.defineProperty(exports, "__esModule", { value: !0 }), exports.sub = exports.mul = void 0, exports.create = create, exports.clone = clone, exports.copy = copy, exports.identity = identity, exports.fromValues = fromValues, exports.set = set, exports.invert = invert, exports.determinant = determinant, exports.multiply = multiply, exports.rotate = rotate, exports.scale = scale, exports.translate = translate, exports.fromRotation = fromRotation, exports.fromScaling = fromScaling, exports.fromTranslation = fromTranslation, exports.str = str, exports.frob = frob, exports.add = add, exports.subtract = subtract, exports.multiplyScalar = multiplyScalar, exports.multiplyScalarAndAdd = multiplyScalarAndAdd, exports.exactEquals = exactEquals, exports.equals = equals;var _common = __webpack_require__(3),
        glMatrix = function (obj) {
      if (obj && obj.__esModule) return obj;var newObj = {};if (null != obj) for (var key in obj) {
        Object.prototype.hasOwnProperty.call(obj, key) && (newObj[key] = obj[key]);
      }return newObj.default = obj, newObj;
    }(_common);exports.mul = multiply, exports.sub = subtract;
  }, function (module, exports, __webpack_require__) {
    "use strict";
    function _interopRequireWildcard(obj) {
      if (obj && obj.__esModule) return obj;var newObj = {};if (null != obj) for (var key in obj) {
        Object.prototype.hasOwnProperty.call(obj, key) && (newObj[key] = obj[key]);
      }return newObj.default = obj, newObj;
    }function create() {
      var dq = new glMatrix.ARRAY_TYPE(8);return glMatrix.ARRAY_TYPE != Float32Array && (dq[0] = 0, dq[1] = 0, dq[2] = 0, dq[4] = 0, dq[5] = 0, dq[6] = 0, dq[7] = 0), dq[3] = 1, dq;
    }function clone(a) {
      var dq = new glMatrix.ARRAY_TYPE(8);return dq[0] = a[0], dq[1] = a[1], dq[2] = a[2], dq[3] = a[3], dq[4] = a[4], dq[5] = a[5], dq[6] = a[6], dq[7] = a[7], dq;
    }function fromValues(x1, y1, z1, w1, x2, y2, z2, w2) {
      var dq = new glMatrix.ARRAY_TYPE(8);return dq[0] = x1, dq[1] = y1, dq[2] = z1, dq[3] = w1, dq[4] = x2, dq[5] = y2, dq[6] = z2, dq[7] = w2, dq;
    }function fromRotationTranslationValues(x1, y1, z1, w1, x2, y2, z2) {
      var dq = new glMatrix.ARRAY_TYPE(8);dq[0] = x1, dq[1] = y1, dq[2] = z1, dq[3] = w1;var ax = .5 * x2,
          ay = .5 * y2,
          az = .5 * z2;return dq[4] = ax * w1 + ay * z1 - az * y1, dq[5] = ay * w1 + az * x1 - ax * z1, dq[6] = az * w1 + ax * y1 - ay * x1, dq[7] = -ax * x1 - ay * y1 - az * z1, dq;
    }function fromRotationTranslation(out, q, t) {
      var ax = .5 * t[0],
          ay = .5 * t[1],
          az = .5 * t[2],
          bx = q[0],
          by = q[1],
          bz = q[2],
          bw = q[3];return out[0] = bx, out[1] = by, out[2] = bz, out[3] = bw, out[4] = ax * bw + ay * bz - az * by, out[5] = ay * bw + az * bx - ax * bz, out[6] = az * bw + ax * by - ay * bx, out[7] = -ax * bx - ay * by - az * bz, out;
    }function fromTranslation(out, t) {
      return out[0] = 0, out[1] = 0, out[2] = 0, out[3] = 1, out[4] = .5 * t[0], out[5] = .5 * t[1], out[6] = .5 * t[2], out[7] = 0, out;
    }function fromRotation(out, q) {
      return out[0] = q[0], out[1] = q[1], out[2] = q[2], out[3] = q[3], out[4] = 0, out[5] = 0, out[6] = 0, out[7] = 0, out;
    }function fromMat4(out, a) {
      var outer = quat.create();mat4.getRotation(outer, a);var t = new glMatrix.ARRAY_TYPE(3);return mat4.getTranslation(t, a), fromRotationTranslation(out, outer, t), out;
    }function copy(out, a) {
      return out[0] = a[0], out[1] = a[1], out[2] = a[2], out[3] = a[3], out[4] = a[4], out[5] = a[5], out[6] = a[6], out[7] = a[7], out;
    }function identity(out) {
      return out[0] = 0, out[1] = 0, out[2] = 0, out[3] = 1, out[4] = 0, out[5] = 0, out[6] = 0, out[7] = 0, out;
    }function set(out, x1, y1, z1, w1, x2, y2, z2, w2) {
      return out[0] = x1, out[1] = y1, out[2] = z1, out[3] = w1, out[4] = x2, out[5] = y2, out[6] = z2, out[7] = w2, out;
    }function getDual(out, a) {
      return out[0] = a[4], out[1] = a[5], out[2] = a[6], out[3] = a[7], out;
    }function setDual(out, q) {
      return out[4] = q[0], out[5] = q[1], out[6] = q[2], out[7] = q[3], out;
    }function getTranslation(out, a) {
      var ax = a[4],
          ay = a[5],
          az = a[6],
          aw = a[7],
          bx = -a[0],
          by = -a[1],
          bz = -a[2],
          bw = a[3];return out[0] = 2 * (ax * bw + aw * bx + ay * bz - az * by), out[1] = 2 * (ay * bw + aw * by + az * bx - ax * bz), out[2] = 2 * (az * bw + aw * bz + ax * by - ay * bx), out;
    }function translate(out, a, v) {
      var ax1 = a[0],
          ay1 = a[1],
          az1 = a[2],
          aw1 = a[3],
          bx1 = .5 * v[0],
          by1 = .5 * v[1],
          bz1 = .5 * v[2],
          ax2 = a[4],
          ay2 = a[5],
          az2 = a[6],
          aw2 = a[7];return out[0] = ax1, out[1] = ay1, out[2] = az1, out[3] = aw1, out[4] = aw1 * bx1 + ay1 * bz1 - az1 * by1 + ax2, out[5] = aw1 * by1 + az1 * bx1 - ax1 * bz1 + ay2, out[6] = aw1 * bz1 + ax1 * by1 - ay1 * bx1 + az2, out[7] = -ax1 * bx1 - ay1 * by1 - az1 * bz1 + aw2, out;
    }function rotateX(out, a, rad) {
      var bx = -a[0],
          by = -a[1],
          bz = -a[2],
          bw = a[3],
          ax = a[4],
          ay = a[5],
          az = a[6],
          aw = a[7],
          ax1 = ax * bw + aw * bx + ay * bz - az * by,
          ay1 = ay * bw + aw * by + az * bx - ax * bz,
          az1 = az * bw + aw * bz + ax * by - ay * bx,
          aw1 = aw * bw - ax * bx - ay * by - az * bz;return quat.rotateX(out, a, rad), bx = out[0], by = out[1], bz = out[2], bw = out[3], out[4] = ax1 * bw + aw1 * bx + ay1 * bz - az1 * by, out[5] = ay1 * bw + aw1 * by + az1 * bx - ax1 * bz, out[6] = az1 * bw + aw1 * bz + ax1 * by - ay1 * bx, out[7] = aw1 * bw - ax1 * bx - ay1 * by - az1 * bz, out;
    }function rotateY(out, a, rad) {
      var bx = -a[0],
          by = -a[1],
          bz = -a[2],
          bw = a[3],
          ax = a[4],
          ay = a[5],
          az = a[6],
          aw = a[7],
          ax1 = ax * bw + aw * bx + ay * bz - az * by,
          ay1 = ay * bw + aw * by + az * bx - ax * bz,
          az1 = az * bw + aw * bz + ax * by - ay * bx,
          aw1 = aw * bw - ax * bx - ay * by - az * bz;return quat.rotateY(out, a, rad), bx = out[0], by = out[1], bz = out[2], bw = out[3], out[4] = ax1 * bw + aw1 * bx + ay1 * bz - az1 * by, out[5] = ay1 * bw + aw1 * by + az1 * bx - ax1 * bz, out[6] = az1 * bw + aw1 * bz + ax1 * by - ay1 * bx, out[7] = aw1 * bw - ax1 * bx - ay1 * by - az1 * bz, out;
    }function rotateZ(out, a, rad) {
      var bx = -a[0],
          by = -a[1],
          bz = -a[2],
          bw = a[3],
          ax = a[4],
          ay = a[5],
          az = a[6],
          aw = a[7],
          ax1 = ax * bw + aw * bx + ay * bz - az * by,
          ay1 = ay * bw + aw * by + az * bx - ax * bz,
          az1 = az * bw + aw * bz + ax * by - ay * bx,
          aw1 = aw * bw - ax * bx - ay * by - az * bz;return quat.rotateZ(out, a, rad), bx = out[0], by = out[1], bz = out[2], bw = out[3], out[4] = ax1 * bw + aw1 * bx + ay1 * bz - az1 * by, out[5] = ay1 * bw + aw1 * by + az1 * bx - ax1 * bz, out[6] = az1 * bw + aw1 * bz + ax1 * by - ay1 * bx, out[7] = aw1 * bw - ax1 * bx - ay1 * by - az1 * bz, out;
    }function rotateByQuatAppend(out, a, q) {
      var qx = q[0],
          qy = q[1],
          qz = q[2],
          qw = q[3],
          ax = a[0],
          ay = a[1],
          az = a[2],
          aw = a[3];return out[0] = ax * qw + aw * qx + ay * qz - az * qy, out[1] = ay * qw + aw * qy + az * qx - ax * qz, out[2] = az * qw + aw * qz + ax * qy - ay * qx, out[3] = aw * qw - ax * qx - ay * qy - az * qz, ax = a[4], ay = a[5], az = a[6], aw = a[7], out[4] = ax * qw + aw * qx + ay * qz - az * qy, out[5] = ay * qw + aw * qy + az * qx - ax * qz, out[6] = az * qw + aw * qz + ax * qy - ay * qx, out[7] = aw * qw - ax * qx - ay * qy - az * qz, out;
    }function rotateByQuatPrepend(out, q, a) {
      var qx = q[0],
          qy = q[1],
          qz = q[2],
          qw = q[3],
          bx = a[0],
          by = a[1],
          bz = a[2],
          bw = a[3];return out[0] = qx * bw + qw * bx + qy * bz - qz * by, out[1] = qy * bw + qw * by + qz * bx - qx * bz, out[2] = qz * bw + qw * bz + qx * by - qy * bx, out[3] = qw * bw - qx * bx - qy * by - qz * bz, bx = a[4], by = a[5], bz = a[6], bw = a[7], out[4] = qx * bw + qw * bx + qy * bz - qz * by, out[5] = qy * bw + qw * by + qz * bx - qx * bz, out[6] = qz * bw + qw * bz + qx * by - qy * bx, out[7] = qw * bw - qx * bx - qy * by - qz * bz, out;
    }function rotateAroundAxis(out, a, axis, rad) {
      if (Math.abs(rad) < glMatrix.EPSILON) return copy(out, a);var axisLength = Math.sqrt(axis[0] * axis[0] + axis[1] * axis[1] + axis[2] * axis[2]);rad *= .5;var s = Math.sin(rad),
          bx = s * axis[0] / axisLength,
          by = s * axis[1] / axisLength,
          bz = s * axis[2] / axisLength,
          bw = Math.cos(rad),
          ax1 = a[0],
          ay1 = a[1],
          az1 = a[2],
          aw1 = a[3];out[0] = ax1 * bw + aw1 * bx + ay1 * bz - az1 * by, out[1] = ay1 * bw + aw1 * by + az1 * bx - ax1 * bz, out[2] = az1 * bw + aw1 * bz + ax1 * by - ay1 * bx, out[3] = aw1 * bw - ax1 * bx - ay1 * by - az1 * bz;var ax = a[4],
          ay = a[5],
          az = a[6],
          aw = a[7];return out[4] = ax * bw + aw * bx + ay * bz - az * by, out[5] = ay * bw + aw * by + az * bx - ax * bz, out[6] = az * bw + aw * bz + ax * by - ay * bx, out[7] = aw * bw - ax * bx - ay * by - az * bz, out;
    }function add(out, a, b) {
      return out[0] = a[0] + b[0], out[1] = a[1] + b[1], out[2] = a[2] + b[2], out[3] = a[3] + b[3], out[4] = a[4] + b[4], out[5] = a[5] + b[5], out[6] = a[6] + b[6], out[7] = a[7] + b[7], out;
    }function multiply(out, a, b) {
      var ax0 = a[0],
          ay0 = a[1],
          az0 = a[2],
          aw0 = a[3],
          bx1 = b[4],
          by1 = b[5],
          bz1 = b[6],
          bw1 = b[7],
          ax1 = a[4],
          ay1 = a[5],
          az1 = a[6],
          aw1 = a[7],
          bx0 = b[0],
          by0 = b[1],
          bz0 = b[2],
          bw0 = b[3];return out[0] = ax0 * bw0 + aw0 * bx0 + ay0 * bz0 - az0 * by0, out[1] = ay0 * bw0 + aw0 * by0 + az0 * bx0 - ax0 * bz0, out[2] = az0 * bw0 + aw0 * bz0 + ax0 * by0 - ay0 * bx0, out[3] = aw0 * bw0 - ax0 * bx0 - ay0 * by0 - az0 * bz0, out[4] = ax0 * bw1 + aw0 * bx1 + ay0 * bz1 - az0 * by1 + ax1 * bw0 + aw1 * bx0 + ay1 * bz0 - az1 * by0, out[5] = ay0 * bw1 + aw0 * by1 + az0 * bx1 - ax0 * bz1 + ay1 * bw0 + aw1 * by0 + az1 * bx0 - ax1 * bz0, out[6] = az0 * bw1 + aw0 * bz1 + ax0 * by1 - ay0 * bx1 + az1 * bw0 + aw1 * bz0 + ax1 * by0 - ay1 * bx0, out[7] = aw0 * bw1 - ax0 * bx1 - ay0 * by1 - az0 * bz1 + aw1 * bw0 - ax1 * bx0 - ay1 * by0 - az1 * bz0, out;
    }function scale(out, a, b) {
      return out[0] = a[0] * b, out[1] = a[1] * b, out[2] = a[2] * b, out[3] = a[3] * b, out[4] = a[4] * b, out[5] = a[5] * b, out[6] = a[6] * b, out[7] = a[7] * b, out;
    }function lerp(out, a, b, t) {
      var mt = 1 - t;return dot(a, b) < 0 && (t = -t), out[0] = a[0] * mt + b[0] * t, out[1] = a[1] * mt + b[1] * t, out[2] = a[2] * mt + b[2] * t, out[3] = a[3] * mt + b[3] * t, out[4] = a[4] * mt + b[4] * t, out[5] = a[5] * mt + b[5] * t, out[6] = a[6] * mt + b[6] * t, out[7] = a[7] * mt + b[7] * t, out;
    }function invert(out, a) {
      var sqlen = squaredLength(a);return out[0] = -a[0] / sqlen, out[1] = -a[1] / sqlen, out[2] = -a[2] / sqlen, out[3] = a[3] / sqlen, out[4] = -a[4] / sqlen, out[5] = -a[5] / sqlen, out[6] = -a[6] / sqlen, out[7] = a[7] / sqlen, out;
    }function conjugate(out, a) {
      return out[0] = -a[0], out[1] = -a[1], out[2] = -a[2], out[3] = a[3], out[4] = -a[4], out[5] = -a[5], out[6] = -a[6], out[7] = a[7], out;
    }function normalize(out, a) {
      var magnitude = squaredLength(a);if (magnitude > 0) {
        magnitude = Math.sqrt(magnitude);var a0 = a[0] / magnitude,
            a1 = a[1] / magnitude,
            a2 = a[2] / magnitude,
            a3 = a[3] / magnitude,
            b0 = a[4],
            b1 = a[5],
            b2 = a[6],
            b3 = a[7],
            a_dot_b = a0 * b0 + a1 * b1 + a2 * b2 + a3 * b3;out[0] = a0, out[1] = a1, out[2] = a2, out[3] = a3, out[4] = (b0 - a0 * a_dot_b) / magnitude, out[5] = (b1 - a1 * a_dot_b) / magnitude, out[6] = (b2 - a2 * a_dot_b) / magnitude, out[7] = (b3 - a3 * a_dot_b) / magnitude;
      }return out;
    }function str(a) {
      return "quat2(" + a[0] + ", " + a[1] + ", " + a[2] + ", " + a[3] + ", " + a[4] + ", " + a[5] + ", " + a[6] + ", " + a[7] + ")";
    }function exactEquals(a, b) {
      return a[0] === b[0] && a[1] === b[1] && a[2] === b[2] && a[3] === b[3] && a[4] === b[4] && a[5] === b[5] && a[6] === b[6] && a[7] === b[7];
    }function equals(a, b) {
      var a0 = a[0],
          a1 = a[1],
          a2 = a[2],
          a3 = a[3],
          a4 = a[4],
          a5 = a[5],
          a6 = a[6],
          a7 = a[7],
          b0 = b[0],
          b1 = b[1],
          b2 = b[2],
          b3 = b[3],
          b4 = b[4],
          b5 = b[5],
          b6 = b[6],
          b7 = b[7];return Math.abs(a0 - b0) <= glMatrix.EPSILON * Math.max(1, Math.abs(a0), Math.abs(b0)) && Math.abs(a1 - b1) <= glMatrix.EPSILON * Math.max(1, Math.abs(a1), Math.abs(b1)) && Math.abs(a2 - b2) <= glMatrix.EPSILON * Math.max(1, Math.abs(a2), Math.abs(b2)) && Math.abs(a3 - b3) <= glMatrix.EPSILON * Math.max(1, Math.abs(a3), Math.abs(b3)) && Math.abs(a4 - b4) <= glMatrix.EPSILON * Math.max(1, Math.abs(a4), Math.abs(b4)) && Math.abs(a5 - b5) <= glMatrix.EPSILON * Math.max(1, Math.abs(a5), Math.abs(b5)) && Math.abs(a6 - b6) <= glMatrix.EPSILON * Math.max(1, Math.abs(a6), Math.abs(b6)) && Math.abs(a7 - b7) <= glMatrix.EPSILON * Math.max(1, Math.abs(a7), Math.abs(b7));
    }Object.defineProperty(exports, "__esModule", { value: !0 }), exports.sqrLen = exports.squaredLength = exports.len = exports.length = exports.dot = exports.mul = exports.setReal = exports.getReal = void 0, exports.create = create, exports.clone = clone, exports.fromValues = fromValues, exports.fromRotationTranslationValues = fromRotationTranslationValues, exports.fromRotationTranslation = fromRotationTranslation, exports.fromTranslation = fromTranslation, exports.fromRotation = fromRotation, exports.fromMat4 = fromMat4, exports.copy = copy, exports.identity = identity, exports.set = set, exports.getDual = getDual, exports.setDual = setDual, exports.getTranslation = getTranslation, exports.translate = translate, exports.rotateX = rotateX, exports.rotateY = rotateY, exports.rotateZ = rotateZ, exports.rotateByQuatAppend = rotateByQuatAppend, exports.rotateByQuatPrepend = rotateByQuatPrepend, exports.rotateAroundAxis = rotateAroundAxis, exports.add = add, exports.multiply = multiply, exports.scale = scale, exports.lerp = lerp, exports.invert = invert, exports.conjugate = conjugate, exports.normalize = normalize, exports.str = str, exports.exactEquals = exactEquals, exports.equals = equals;var _common = __webpack_require__(3),
        glMatrix = _interopRequireWildcard(_common),
        _quat = __webpack_require__(19),
        quat = _interopRequireWildcard(_quat),
        _mat = __webpack_require__(18),
        mat4 = _interopRequireWildcard(_mat),
        dot = (exports.getReal = quat.copy, exports.setReal = quat.copy, exports.mul = multiply, exports.dot = quat.dot),
        length = exports.length = quat.length,
        squaredLength = (exports.len = length, exports.squaredLength = quat.squaredLength);exports.sqrLen = squaredLength;
  }, function (module, exports, __webpack_require__) {
    "use strict";
    function create() {
      var out = new glMatrix.ARRAY_TYPE(2);return glMatrix.ARRAY_TYPE != Float32Array && (out[0] = 0, out[1] = 0), out;
    }function clone(a) {
      var out = new glMatrix.ARRAY_TYPE(2);return out[0] = a[0], out[1] = a[1], out;
    }function fromValues(x, y) {
      var out = new glMatrix.ARRAY_TYPE(2);return out[0] = x, out[1] = y, out;
    }function copy(out, a) {
      return out[0] = a[0], out[1] = a[1], out;
    }function set(out, x, y) {
      return out[0] = x, out[1] = y, out;
    }function add(out, a, b) {
      return out[0] = a[0] + b[0], out[1] = a[1] + b[1], out;
    }function subtract(out, a, b) {
      return out[0] = a[0] - b[0], out[1] = a[1] - b[1], out;
    }function multiply(out, a, b) {
      return out[0] = a[0] * b[0], out[1] = a[1] * b[1], out;
    }function divide(out, a, b) {
      return out[0] = a[0] / b[0], out[1] = a[1] / b[1], out;
    }function ceil(out, a) {
      return out[0] = Math.ceil(a[0]), out[1] = Math.ceil(a[1]), out;
    }function floor(out, a) {
      return out[0] = Math.floor(a[0]), out[1] = Math.floor(a[1]), out;
    }function min(out, a, b) {
      return out[0] = Math.min(a[0], b[0]), out[1] = Math.min(a[1], b[1]), out;
    }function max(out, a, b) {
      return out[0] = Math.max(a[0], b[0]), out[1] = Math.max(a[1], b[1]), out;
    }function round(out, a) {
      return out[0] = Math.round(a[0]), out[1] = Math.round(a[1]), out;
    }function scale(out, a, b) {
      return out[0] = a[0] * b, out[1] = a[1] * b, out;
    }function scaleAndAdd(out, a, b, scale) {
      return out[0] = a[0] + b[0] * scale, out[1] = a[1] + b[1] * scale, out;
    }function distance(a, b) {
      var x = b[0] - a[0],
          y = b[1] - a[1];return Math.sqrt(x * x + y * y);
    }function squaredDistance(a, b) {
      var x = b[0] - a[0],
          y = b[1] - a[1];return x * x + y * y;
    }function length(a) {
      var x = a[0],
          y = a[1];return Math.sqrt(x * x + y * y);
    }function squaredLength(a) {
      var x = a[0],
          y = a[1];return x * x + y * y;
    }function negate(out, a) {
      return out[0] = -a[0], out[1] = -a[1], out;
    }function inverse(out, a) {
      return out[0] = 1 / a[0], out[1] = 1 / a[1], out;
    }function normalize(out, a) {
      var x = a[0],
          y = a[1],
          len = x * x + y * y;return len > 0 && (len = 1 / Math.sqrt(len), out[0] = a[0] * len, out[1] = a[1] * len), out;
    }function dot(a, b) {
      return a[0] * b[0] + a[1] * b[1];
    }function cross(out, a, b) {
      var z = a[0] * b[1] - a[1] * b[0];return out[0] = out[1] = 0, out[2] = z, out;
    }function lerp(out, a, b, t) {
      var ax = a[0],
          ay = a[1];return out[0] = ax + t * (b[0] - ax), out[1] = ay + t * (b[1] - ay), out;
    }function random(out, scale) {
      scale = scale || 1;var r = 2 * glMatrix.RANDOM() * Math.PI;return out[0] = Math.cos(r) * scale, out[1] = Math.sin(r) * scale, out;
    }function transformMat2(out, a, m) {
      var x = a[0],
          y = a[1];return out[0] = m[0] * x + m[2] * y, out[1] = m[1] * x + m[3] * y, out;
    }function transformMat2d(out, a, m) {
      var x = a[0],
          y = a[1];return out[0] = m[0] * x + m[2] * y + m[4], out[1] = m[1] * x + m[3] * y + m[5], out;
    }function transformMat3(out, a, m) {
      var x = a[0],
          y = a[1];return out[0] = m[0] * x + m[3] * y + m[6], out[1] = m[1] * x + m[4] * y + m[7], out;
    }function transformMat4(out, a, m) {
      var x = a[0],
          y = a[1];return out[0] = m[0] * x + m[4] * y + m[12], out[1] = m[1] * x + m[5] * y + m[13], out;
    }function rotate(out, a, b, c) {
      var p0 = a[0] - b[0],
          p1 = a[1] - b[1],
          sinC = Math.sin(c),
          cosC = Math.cos(c);return out[0] = p0 * cosC - p1 * sinC + b[0], out[1] = p0 * sinC + p1 * cosC + b[1], out;
    }function angle(a, b) {
      var x1 = a[0],
          y1 = a[1],
          x2 = b[0],
          y2 = b[1],
          len1 = x1 * x1 + y1 * y1;len1 > 0 && (len1 = 1 / Math.sqrt(len1));var len2 = x2 * x2 + y2 * y2;len2 > 0 && (len2 = 1 / Math.sqrt(len2));var cosine = (x1 * x2 + y1 * y2) * len1 * len2;return cosine > 1 ? 0 : cosine < -1 ? Math.PI : Math.acos(cosine);
    }function str(a) {
      return "vec2(" + a[0] + ", " + a[1] + ")";
    }function exactEquals(a, b) {
      return a[0] === b[0] && a[1] === b[1];
    }function equals(a, b) {
      var a0 = a[0],
          a1 = a[1],
          b0 = b[0],
          b1 = b[1];return Math.abs(a0 - b0) <= glMatrix.EPSILON * Math.max(1, Math.abs(a0), Math.abs(b0)) && Math.abs(a1 - b1) <= glMatrix.EPSILON * Math.max(1, Math.abs(a1), Math.abs(b1));
    }Object.defineProperty(exports, "__esModule", { value: !0 }), exports.forEach = exports.sqrLen = exports.sqrDist = exports.dist = exports.div = exports.mul = exports.sub = exports.len = void 0, exports.create = create, exports.clone = clone, exports.fromValues = fromValues, exports.copy = copy, exports.set = set, exports.add = add, exports.subtract = subtract, exports.multiply = multiply, exports.divide = divide, exports.ceil = ceil, exports.floor = floor, exports.min = min, exports.max = max, exports.round = round, exports.scale = scale, exports.scaleAndAdd = scaleAndAdd, exports.distance = distance, exports.squaredDistance = squaredDistance, exports.length = length, exports.squaredLength = squaredLength, exports.negate = negate, exports.inverse = inverse, exports.normalize = normalize, exports.dot = dot, exports.cross = cross, exports.lerp = lerp, exports.random = random, exports.transformMat2 = transformMat2, exports.transformMat2d = transformMat2d, exports.transformMat3 = transformMat3, exports.transformMat4 = transformMat4, exports.rotate = rotate, exports.angle = angle, exports.str = str, exports.exactEquals = exactEquals, exports.equals = equals;var _common = __webpack_require__(3),
        glMatrix = function (obj) {
      if (obj && obj.__esModule) return obj;var newObj = {};if (null != obj) for (var key in obj) {
        Object.prototype.hasOwnProperty.call(obj, key) && (newObj[key] = obj[key]);
      }return newObj.default = obj, newObj;
    }(_common);exports.len = length, exports.sub = subtract, exports.mul = multiply, exports.div = divide, exports.dist = distance, exports.sqrDist = squaredDistance, exports.sqrLen = squaredLength, exports.forEach = function () {
      var vec = create();return function (a, stride, offset, count, fn, arg) {
        var i = void 0,
            l = void 0;for (stride || (stride = 2), offset || (offset = 0), l = count ? Math.min(count * stride + offset, a.length) : a.length, i = offset; i < l; i += stride) {
          vec[0] = a[i], vec[1] = a[i + 1], fn(vec, vec, arg), a[i] = vec[0], a[i + 1] = vec[1];
        }return a;
      };
    }();
  }, function (module, exports, __webpack_require__) {
    "use strict";
    function getAndApplyExtension(gl, name) {
      var ext = gl.getExtension(name);if (!ext) return !1;var suffix = name.split("_")[0],
          suffixRE = new RegExp(suffix + "$");for (var key in ext) {
        if ("function" == typeof ext[key]) {
          var unsuffixedKey = key.replace(suffixRE, "");key.substring && (gl[unsuffixedKey] = ext[key].bind(ext));
        }
      }return !0;
    }Object.defineProperty(exports, "__esModule", { value: !0 }), exports.default = getAndApplyExtension;
  }, function (module, exports, __webpack_require__) {
    "use strict";
    function _interopRequireDefault(obj) {
      return obj && obj.__esModule ? obj : { default: obj };
    }Object.defineProperty(exports, "__esModule", { value: !0 });var _GLTool = __webpack_require__(0),
        _GLTool2 = _interopRequireDefault(_GLTool),
        _WebglConst = __webpack_require__(42),
        _WebglConst2 = _interopRequireDefault(_WebglConst),
        _WebglNumber = __webpack_require__(7),
        _WebglNumber2 = _interopRequireDefault(_WebglNumber),
        exposeAttributes = function exposeAttributes() {
      for (var s in _WebglConst2.default) {
        _GLTool2.default[s] ? "FLOAT" !== s && console.log("already exist : ", s) : _GLTool2.default[s] = _WebglConst2.default[s];
      }if (_GLTool2.default.webgl2) {
        var check = /^[^a-z]*$/;for (var _s in _GLTool2.default.gl) {
          check.test(_s) && -1 === _s.indexOf("FLOAT") && (_GLTool2.default[_s] = _GLTool2.default.gl[_s], _WebglConst2.default[_s] = _GLTool2.default.gl[_s], _WebglNumber2.default[_GLTool2.default[_s]] = _s);
        }
      }
    };exports.default = exposeAttributes;
  }, function (module, exports, __webpack_require__) {
    "use strict";
    module.exports = { ACTIVE_ATTRIBUTES: 35721, ACTIVE_ATTRIBUTE_MAX_LENGTH: 35722, ACTIVE_TEXTURE: 34016, ACTIVE_UNIFORMS: 35718, ACTIVE_UNIFORM_MAX_LENGTH: 35719, ALIASED_LINE_WIDTH_RANGE: 33902, ALIASED_POINT_SIZE_RANGE: 33901, ALPHA: 6406, ALPHA_BITS: 3413, ALWAYS: 519, ARRAY_BUFFER: 34962, ARRAY_BUFFER_BINDING: 34964, ATTACHED_SHADERS: 35717, BACK: 1029, BLEND: 3042, BLEND_COLOR: 32773, BLEND_DST_ALPHA: 32970, BLEND_DST_RGB: 32968, BLEND_EQUATION: 32777, BLEND_EQUATION_ALPHA: 34877, BLEND_EQUATION_RGB: 32777, BLEND_SRC_ALPHA: 32971, BLEND_SRC_RGB: 32969, BLUE_BITS: 3412, BOOL: 35670, BOOL_VEC2: 35671, BOOL_VEC3: 35672, BOOL_VEC4: 35673, BROWSER_DEFAULT_WEBGL: 37444, BUFFER_SIZE: 34660, BUFFER_USAGE: 34661, BYTE: 5120, CCW: 2305, CLAMP_TO_EDGE: 33071, COLOR_ATTACHMENT0: 36064, COLOR_BUFFER_BIT: 16384, COLOR_CLEAR_VALUE: 3106, COLOR_WRITEMASK: 3107, COMPILE_STATUS: 35713, COMPRESSED_TEXTURE_FORMATS: 34467, CONSTANT_ALPHA: 32771, CONSTANT_COLOR: 32769, CONTEXT_LOST_WEBGL: 37442, CULL_FACE: 2884, CULL_FACE_MODE: 2885, CURRENT_PROGRAM: 35725, CURRENT_VERTEX_ATTRIB: 34342, CW: 2304, DECR: 7683, DECR_WRAP: 34056, DELETE_STATUS: 35712, DEPTH_ATTACHMENT: 36096, DEPTH_BITS: 3414, DEPTH_BUFFER_BIT: 256, DEPTH_CLEAR_VALUE: 2931, DEPTH_COMPONENT: 6402, RED: 6403, DEPTH_COMPONENT16: 33189, DEPTH_FUNC: 2932, DEPTH_RANGE: 2928, DEPTH_STENCIL: 34041, DEPTH_STENCIL_ATTACHMENT: 33306, DEPTH_TEST: 2929, DEPTH_WRITEMASK: 2930, DITHER: 3024, DONT_CARE: 4352, DST_ALPHA: 772, DST_COLOR: 774, DYNAMIC_DRAW: 35048, ELEMENT_ARRAY_BUFFER: 34963, ELEMENT_ARRAY_BUFFER_BINDING: 34965, EQUAL: 514, FASTEST: 4353, FLOAT: 5126, FLOAT_MAT2: 35674, FLOAT_MAT3: 35675, FLOAT_MAT4: 35676, FLOAT_VEC2: 35664, FLOAT_VEC3: 35665, FLOAT_VEC4: 35666, FRAGMENT_SHADER: 35632, FRAMEBUFFER: 36160, FRAMEBUFFER_ATTACHMENT_OBJECT_NAME: 36049, FRAMEBUFFER_ATTACHMENT_OBJECT_TYPE: 36048, FRAMEBUFFER_ATTACHMENT_TEXTURE_CUBE_MAP_FACE: 36051, FRAMEBUFFER_ATTACHMENT_TEXTURE_LEVEL: 36050, FRAMEBUFFER_BINDING: 36006, FRAMEBUFFER_COMPLETE: 36053, FRAMEBUFFER_INCOMPLETE_ATTACHMENT: 36054, FRAMEBUFFER_INCOMPLETE_DIMENSIONS: 36057, FRAMEBUFFER_INCOMPLETE_MISSING_ATTACHMENT: 36055, FRAMEBUFFER_UNSUPPORTED: 36061, FRONT: 1028, FRONT_AND_BACK: 1032, FRONT_FACE: 2886, FUNC_ADD: 32774, FUNC_REVERSE_SUBTRACT: 32779, FUNC_SUBTRACT: 32778, GENERATE_MIPMAP_HINT: 33170, GEQUAL: 518, GREATER: 516, GREEN_BITS: 3411, HIGH_FLOAT: 36338, HIGH_INT: 36341, INCR: 7682, INCR_WRAP: 34055, INFO_LOG_LENGTH: 35716, INT: 5124, INT_VEC2: 35667, INT_VEC3: 35668, INT_VEC4: 35669, INVALID_ENUM: 1280, INVALID_FRAMEBUFFER_OPERATION: 1286, INVALID_OPERATION: 1282, INVALID_VALUE: 1281, INVERT: 5386, KEEP: 7680, LEQUAL: 515, LESS: 513, LINEAR: 9729, LINEAR_MIPMAP_LINEAR: 9987, LINEAR_MIPMAP_NEAREST: 9985, LINES: 1, LINE_LOOP: 2, LINE_STRIP: 3, LINE_WIDTH: 2849, LINK_STATUS: 35714, LOW_FLOAT: 36336, LOW_INT: 36339, LUMINANCE: 6409, LUMINANCE_ALPHA: 6410, MAX_COMBINED_TEXTURE_IMAGE_UNITS: 35661, MAX_CUBE_MAP_TEXTURE_SIZE: 34076, MAX_FRAGMENT_UNIFORM_VECTORS: 36349, MAX_RENDERBUFFER_SIZE: 34024, MAX_TEXTURE_IMAGE_UNITS: 34930, MAX_TEXTURE_SIZE: 3379, MAX_VARYING_VECTORS: 36348, MAX_VERTEX_ATTRIBS: 34921, MAX_VERTEX_TEXTURE_IMAGE_UNITS: 35660, MAX_VERTEX_UNIFORM_VECTORS: 36347, MAX_VIEWPORT_DIMS: 3386, MEDIUM_FLOAT: 36337, MEDIUM_INT: 36340, MIRRORED_REPEAT: 33648, NEAREST: 9728, NEAREST_MIPMAP_LINEAR: 9986, NEAREST_MIPMAP_NEAREST: 9984, NEVER: 512, NICEST: 4354, NONE: 0, NOTEQUAL: 517, NO_ERROR: 0, NUM_COMPRESSED_TEXTURE_FORMATS: 34466, ONE: 1, ONE_MINUS_CONSTANT_ALPHA: 32772, ONE_MINUS_CONSTANT_COLOR: 32770, ONE_MINUS_DST_ALPHA: 773, ONE_MINUS_DST_COLOR: 775, ONE_MINUS_SRC_ALPHA: 771, ONE_MINUS_SRC_COLOR: 769, OUT_OF_MEMORY: 1285, PACK_ALIGNMENT: 3333, POINTS: 0, POLYGON_OFFSET_FACTOR: 32824, POLYGON_OFFSET_FILL: 32823, POLYGON_OFFSET_UNITS: 10752, RED_BITS: 3410, RENDERBUFFER: 36161, RENDERBUFFER_ALPHA_SIZE: 36179, RENDERBUFFER_BINDING: 36007, RENDERBUFFER_BLUE_SIZE: 36178, RENDERBUFFER_DEPTH_SIZE: 36180, RENDERBUFFER_GREEN_SIZE: 36177, RENDERBUFFER_HEIGHT: 36163, RENDERBUFFER_INTERNAL_FORMAT: 36164, RENDERBUFFER_RED_SIZE: 36176, RENDERBUFFER_STENCIL_SIZE: 36181, RENDERBUFFER_WIDTH: 36162, RENDERER: 7937, REPEAT: 10497, REPLACE: 7681, RGB: 6407, RGB5_A1: 32855, RGB565: 36194, RGBA: 6408, RGBA4: 32854, SAMPLER_2D: 35678, SAMPLER_CUBE: 35680, SAMPLES: 32937, SAMPLE_ALPHA_TO_COVERAGE: 32926, SAMPLE_BUFFERS: 32936, SAMPLE_COVERAGE: 32928, SAMPLE_COVERAGE_INVERT: 32939, SAMPLE_COVERAGE_VALUE: 32938, SCISSOR_BOX: 3088, SCISSOR_TEST: 3089, SHADER_COMPILER: 36346, SHADER_SOURCE_LENGTH: 35720, SHADER_TYPE: 35663, SHADING_LANGUAGE_VERSION: 35724, SHORT: 5122, SRC_ALPHA: 770, SRC_ALPHA_SATURATE: 776, SRC_COLOR: 768, STATIC_DRAW: 35044, STENCIL_ATTACHMENT: 36128, STENCIL_BACK_FAIL: 34817, STENCIL_BACK_FUNC: 34816, STENCIL_BACK_PASS_DEPTH_FAIL: 34818, STENCIL_BACK_PASS_DEPTH_PASS: 34819, STENCIL_BACK_REF: 36003, STENCIL_BACK_VALUE_MASK: 36004, STENCIL_BACK_WRITEMASK: 36005, STENCIL_BITS: 3415, STENCIL_BUFFER_BIT: 1024, STENCIL_CLEAR_VALUE: 2961, STENCIL_FAIL: 2964, STENCIL_FUNC: 2962, STENCIL_INDEX: 6401, STENCIL_INDEX8: 36168, STENCIL_PASS_DEPTH_FAIL: 2965, STENCIL_PASS_DEPTH_PASS: 2966, STENCIL_REF: 2967, STENCIL_TEST: 2960, STENCIL_VALUE_MASK: 2963, STENCIL_WRITEMASK: 2968, STREAM_DRAW: 35040, SUBPIXEL_BITS: 3408, TEXTURE: 5890, TEXTURE0: 33984, TEXTURE1: 33985, TEXTURE2: 33986, TEXTURE3: 33987, TEXTURE4: 33988, TEXTURE5: 33989, TEXTURE6: 33990, TEXTURE7: 33991, TEXTURE8: 33992, TEXTURE9: 33993, TEXTURE10: 33994, TEXTURE11: 33995, TEXTURE12: 33996, TEXTURE13: 33997, TEXTURE14: 33998, TEXTURE15: 33999, TEXTURE16: 34e3, TEXTURE17: 34001, TEXTURE18: 34002, TEXTURE19: 34003, TEXTURE20: 34004, TEXTURE21: 34005, TEXTURE22: 34006, TEXTURE23: 34007, TEXTURE24: 34008, TEXTURE25: 34009, TEXTURE26: 34010, TEXTURE27: 34011, TEXTURE28: 34012, TEXTURE29: 34013, TEXTURE30: 34014, TEXTURE31: 34015, TEXTURE_2D: 3553, TEXTURE_BINDING_2D: 32873, TEXTURE_BINDING_CUBE_MAP: 34068, TEXTURE_CUBE_MAP: 34067, TEXTURE_CUBE_MAP_NEGATIVE_X: 34070, TEXTURE_CUBE_MAP_NEGATIVE_Y: 34072, TEXTURE_CUBE_MAP_NEGATIVE_Z: 34074, TEXTURE_CUBE_MAP_POSITIVE_X: 34069, TEXTURE_CUBE_MAP_POSITIVE_Y: 34071, TEXTURE_CUBE_MAP_POSITIVE_Z: 34073, TEXTURE_MAG_FILTER: 10240, TEXTURE_MIN_FILTER: 10241, TEXTURE_WRAP_S: 10242, TEXTURE_WRAP_T: 10243, TRIANGLES: 4, TRIANGLE_FAN: 6, TRIANGLE_STRIP: 5, UNPACK_ALIGNMENT: 3317, UNPACK_COLORSPACE_CONVERSION_WEBGL: 37443, UNPACK_FLIP_Y_WEBGL: 37440, UNPACK_PREMULTIPLY_ALPHA_WEBGL: 37441, UNSIGNED_BYTE: 5121, UNSIGNED_INT: 5125, UNSIGNED_SHORT: 5123, UNSIGNED_SHORT_4_4_4_4: 32819, UNSIGNED_SHORT_5_5_5_1: 32820, UNSIGNED_SHORT_5_6_5: 33635, VALIDATE_STATUS: 35715, VENDOR: 7936, VERSION: 7938, VERTEX_ATTRIB_ARRAY_BUFFER_BINDING: 34975, VERTEX_ATTRIB_ARRAY_ENABLED: 34338, VERTEX_ATTRIB_ARRAY_NORMALIZED: 34922, VERTEX_ATTRIB_ARRAY_POINTER: 34373, VERTEX_ATTRIB_ARRAY_SIZE: 34339, VERTEX_ATTRIB_ARRAY_STRIDE: 34340, VERTEX_ATTRIB_ARRAY_TYPE: 34341, VERTEX_SHADER: 35633, VIEWPORT: 2978, ZERO: 0, R8: 33321 };
  }, function (module, exports, __webpack_require__) {
    "use strict";
    function checkFloat() {
      return _GLTool2.default.webgl2 ? _GLTool2.default.gl.FLOAT : _GLTool2.default.getExtension("OES_texture_float") ? _GLTool2.default.gl.FLOAT : (console.warn("USING FLOAT BUT OES_texture_float NOT SUPPORTED"), _GLTool2.default.gl.UNSIGNED_BYTE);
    }Object.defineProperty(exports, "__esModule", { value: !0 }), exports.default = function () {
      return hasChecked || (_float = checkFloat()), _float;
    };var _GLTool = __webpack_require__(0),
        _GLTool2 = function (obj) {
      return obj && obj.__esModule ? obj : { default: obj };
    }(_GLTool),
        hasChecked = !1,
        _float = void 0;
  }, function (module, exports, __webpack_require__) {
    "use strict";
    function checkHalfFloat() {
      if (_GLTool2.default.webgl2) return _GLTool2.default.gl.HALF_FLOAT;var extHalfFloat = _GLTool2.default.getExtension("OES_texture_half_float");return extHalfFloat ? extHalfFloat.HALF_FLOAT_OES : (console.warn("USING HALF FLOAT BUT OES_texture_half_float NOT SUPPORTED"), _GLTool2.default.gl.UNSIGNED_BYTE);
    }Object.defineProperty(exports, "__esModule", { value: !0 }), exports.default = function () {
      return hasChecked || (halfFloat = checkHalfFloat()), halfFloat;
    };var _GLTool = __webpack_require__(0),
        _GLTool2 = function (obj) {
      return obj && obj.__esModule ? obj : { default: obj };
    }(_GLTool),
        hasChecked = !1,
        halfFloat = void 0;
  }, function (module, exports, __webpack_require__) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: !0 }), exports.default = ["EXT_shader_texture_lod", "EXT_sRGB", "EXT_frag_depth", "OES_texture_float", "OES_texture_half_float", "OES_texture_float_linear", "OES_texture_half_float_linear", "OES_standard_derivatives", "WEBGL_depth_texture", "EXT_texture_filter_anisotropic", "OES_vertex_array_object", "ANGLE_instanced_arrays", "WEBGL_draw_buffers"];
  }, function (module, exports, __webpack_require__) {
    "use strict";
    module.exports = function (strings) {
      "string" == typeof strings && (strings = [strings]);for (var exprs = [].slice.call(arguments, 1), parts = [], i = 0; i < strings.length - 1; i++) {
        parts.push(strings[i], exprs[i] || "");
      }return parts.push(strings[i]), parts.join("");
    };
  }, function (module, exports) {
    module.exports = "// basic.frag\n\n#define SHADER_NAME BASIC_FRAGMENT\n\nprecision lowp float;\n#define GLSLIFY 1\nvarying vec2 vTextureCoord;\nuniform float time;\n// uniform sampler2D texture;\n\nvoid main(void) {\n    gl_FragColor = vec4(vTextureCoord, sin(time) * .5 + .5, 1.0);\n}";
  }, function (module, exports, __webpack_require__) {
    "use strict";
    function _interopRequireDefault(obj) {
      return obj && obj.__esModule ? obj : { default: obj };
    }function isPowerOfTwo(x) {
      return 0 !== x && !(x & x - 1);
    }Object.defineProperty(exports, "__esModule", { value: !0 });var _GLTool = __webpack_require__(0),
        _GLTool2 = _interopRequireDefault(_GLTool),
        _WebglNumber = __webpack_require__(7),
        getTextureParameters = (_interopRequireDefault(_WebglNumber), function (mParams, mSource, mWidth, mHeight) {
      if (!mParams.minFilter) {
        var minFilter = _GLTool2.default.LINEAR;mWidth && mWidth && isPowerOfTwo(mWidth) && isPowerOfTwo(mHeight) && (minFilter = _GLTool2.default.NEAREST_MIPMAP_LINEAR), mParams.minFilter = minFilter;
      }return mParams.mipmap = void 0 === mParams.mipmap || mParams.mipmap, mParams.magFilter = mParams.magFilter || _GLTool2.default.LINEAR, mParams.wrapS = mParams.wrapS || _GLTool2.default.CLAMP_TO_EDGE, mParams.wrapT = mParams.wrapT || _GLTool2.default.CLAMP_TO_EDGE, mParams.internalFormat = mParams.internalFormat || _GLTool2.default.RGBA, mParams.format = mParams.format || _GLTool2.default.RGBA, mParams.premultiplyAlpha = void 0 !== mParams.premultiplyAlpha && mParams.premultiplyAlpha, mParams.level = mParams.level || 0, _GLTool2.default.webgl2 && mParams.type === _GLTool2.default.FLOAT && (mParams.internalFormat = _GLTool2.default.gl.RGBA32F, mParams.mipmap = !1), mParams;
    });exports.default = getTextureParameters;
  }, function (module, exports, __webpack_require__) {
    "use strict";
    function parseHeaders(arrayBuffer) {
      var header = new Int32Array(arrayBuffer, 0, headerLengthInt);if (header[off_magic] !== DDS_MAGIC) throw new Error("Invalid magic number in DDS header");if (!header[off_pfFlags] & DDPF_FOURCC) throw new Error("Unsupported format, must contain a FourCC code");var blockBytes,
          format,
          fourCC = header[off_pfFourCC];switch (fourCC) {case FOURCC_DXT1:
          blockBytes = 8, format = "dxt1";break;case FOURCC_DXT3:
          blockBytes = 16, format = "dxt3";break;case FOURCC_DXT5:
          blockBytes = 16, format = "dxt5";break;case FOURCC_FP32F:
          format = "rgba32f";break;case FOURCC_DX10:
          var dx10Header = new Uint32Array(arrayBuffer.slice(128, 148));format = dx10Header[0];var resourceDimension = dx10Header[1];dx10Header[2], dx10Header[3], dx10Header[4];if (resourceDimension !== D3D10_RESOURCE_DIMENSION_TEXTURE2D || format !== DXGI_FORMAT_R32G32B32A32_FLOAT) throw new Error("Unsupported DX10 texture format " + format);format = "rgba32f";break;default:
          throw new Error("Unsupported FourCC code: " + int32ToFourCC(fourCC));}var flags = header[off_flags],
          mipmapCount = 1;flags & DDSD_MIPMAPCOUNT && (mipmapCount = Math.max(1, header[off_mipmapCount]));var cubemap = !1;header[off_caps2] & DDSCAPS2_CUBEMAP && (cubemap = !0);var dataLength,
          width = header[off_width],
          height = header[off_height],
          dataOffset = header[off_size] + 4,
          texWidth = width,
          texHeight = height,
          images = [];if (fourCC === FOURCC_DX10 && (dataOffset += 20), cubemap) for (var f = 0; f < 6; f++) {
        if ("rgba32f" !== format) throw new Error("Only RGBA32f cubemaps are supported");width = texWidth, height = texHeight;for (var requiredMipLevels = Math.log(width) / Math.log(2) + 1, i = 0; i < requiredMipLevels; i++) {
          dataLength = width * height * 16, images.push({ offset: dataOffset, length: dataLength, shape: [width, height] }), i < mipmapCount && (dataOffset += dataLength), width = Math.floor(width / 2), height = Math.floor(height / 2);
        }
      } else for (var i = 0; i < mipmapCount; i++) {
        dataLength = Math.max(4, width) / 4 * Math.max(4, height) / 4 * blockBytes, images.push({ offset: dataOffset, length: dataLength, shape: [width, height] }), dataOffset += dataLength, width = Math.floor(width / 2), height = Math.floor(height / 2);
      }return { shape: [texWidth, texHeight], images: images, format: format, flags: flags, cubemap: cubemap };
    }function fourCCToInt32(value) {
      return value.charCodeAt(0) + (value.charCodeAt(1) << 8) + (value.charCodeAt(2) << 16) + (value.charCodeAt(3) << 24);
    }function int32ToFourCC(value) {
      return String.fromCharCode(255 & value, value >> 8 & 255, value >> 16 & 255, value >> 24 & 255);
    }var DDS_MAGIC = 542327876,
        DDSD_MIPMAPCOUNT = 131072,
        DDPF_FOURCC = 4,
        FOURCC_DXT1 = fourCCToInt32("DXT1"),
        FOURCC_DXT3 = fourCCToInt32("DXT3"),
        FOURCC_DXT5 = fourCCToInt32("DXT5"),
        FOURCC_DX10 = fourCCToInt32("DX10"),
        FOURCC_FP32F = 116,
        DDSCAPS2_CUBEMAP = 512,
        D3D10_RESOURCE_DIMENSION_TEXTURE2D = 3,
        DXGI_FORMAT_R32G32B32A32_FLOAT = 2,
        headerLengthInt = 31,
        off_magic = 0,
        off_size = 1,
        off_flags = 2,
        off_height = 3,
        off_width = 4,
        off_mipmapCount = 7,
        off_pfFlags = 20,
        off_pfFourCC = 21,
        off_caps2 = 28;module.exports = parseHeaders;
  }, function (module, exports, __webpack_require__) {
    "use strict";
    function _interopRequireDefault(obj) {
      return obj && obj.__esModule ? obj : { default: obj };
    }function _classCallCheck(instance, Constructor) {
      if (!(instance instanceof Constructor)) throw new TypeError("Cannot call a class as a function");
    }Object.defineProperty(exports, "__esModule", { value: !0 });var _createClass = function () {
      function defineProperties(target, props) {
        for (var i = 0; i < props.length; i++) {
          var descriptor = props[i];descriptor.enumerable = descriptor.enumerable || !1, descriptor.configurable = !0, "value" in descriptor && (descriptor.writable = !0), Object.defineProperty(target, descriptor.key, descriptor);
        }
      }return function (Constructor, protoProps, staticProps) {
        return protoProps && defineProperties(Constructor.prototype, protoProps), staticProps && defineProperties(Constructor, staticProps), Constructor;
      };
    }(),
        _GLTool = __webpack_require__(0),
        _GLTool2 = _interopRequireDefault(_GLTool),
        _GLCubeTexture = __webpack_require__(24),
        _GLCubeTexture2 = _interopRequireDefault(_GLCubeTexture),
        gl = void 0,
        CubeFrameBuffer = function () {
      function CubeFrameBuffer(size) {
        var mParameters = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : {};_classCallCheck(this, CubeFrameBuffer), gl = _GLTool2.default.gl, this._size = size, this.magFilter = mParameters.magFilter || gl.LINEAR, this.minFilter = mParameters.minFilter || gl.LINEAR, this.wrapS = mParameters.wrapS || gl.CLAMP_TO_EDGE, this.wrapT = mParameters.wrapT || gl.CLAMP_TO_EDGE, this._init();
      }return _createClass(CubeFrameBuffer, [{ key: "_init", value: function value() {
          this.texture = gl.createTexture(), this.glTexture = new _GLCubeTexture2.default(this.texture, {}, !0), gl.bindTexture(gl.TEXTURE_CUBE_MAP, this.texture), gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_MAG_FILTER, this.magFilter), gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_MIN_FILTER, this.minFilter), gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_WRAP_S, this.wrapS), gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_WRAP_T, this.wrapT);for (var targets = [gl.TEXTURE_CUBE_MAP_POSITIVE_X, gl.TEXTURE_CUBE_MAP_NEGATIVE_X, gl.TEXTURE_CUBE_MAP_POSITIVE_Y, gl.TEXTURE_CUBE_MAP_NEGATIVE_Y, gl.TEXTURE_CUBE_MAP_POSITIVE_Z, gl.TEXTURE_CUBE_MAP_NEGATIVE_Z], i = 0; i < targets.length; i++) {
            gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, !1), gl.texImage2D(targets[i], 0, gl.RGBA, this.width, this.height, 0, gl.RGBA, gl.FLOAT, null);
          }this._frameBuffers = [];for (var _i = 0; _i < targets.length; _i++) {
            var frameBuffer = gl.createFramebuffer();gl.bindFramebuffer(gl.FRAMEBUFFER, frameBuffer), gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, targets[_i], this.texture, 0);var status = gl.checkFramebufferStatus(gl.FRAMEBUFFER);status !== gl.FRAMEBUFFER_COMPLETE && console.log("'gl.checkFramebufferStatus() returned '" + status), this._frameBuffers.push(frameBuffer);
          }gl.bindFramebuffer(gl.FRAMEBUFFER, null), gl.bindRenderbuffer(gl.RENDERBUFFER, null), gl.bindTexture(gl.TEXTURE_CUBE_MAP, null);
        } }, { key: "bind", value: function value(mTargetIndex) {
          _GLTool2.default.viewport(0, 0, this.width, this.height), gl.bindFramebuffer(gl.FRAMEBUFFER, this._frameBuffers[mTargetIndex]);
        } }, { key: "unbind", value: function value() {
          gl.bindFramebuffer(gl.FRAMEBUFFER, null), _GLTool2.default.viewport(0, 0, _GLTool2.default.width, _GLTool2.default.height);
        } }, { key: "getTexture", value: function value() {
          return this.glTexture;
        } }, { key: "width", get: function get() {
          return this._size;
        } }, { key: "height", get: function get() {
          return this._size;
        } }]), CubeFrameBuffer;
    }();exports.default = CubeFrameBuffer;
  }, function (module, exports, __webpack_require__) {
    "use strict";
    function _interopRequireDefault(obj) {
      return obj && obj.__esModule ? obj : { default: obj };
    }function _classCallCheck(instance, Constructor) {
      if (!(instance instanceof Constructor)) throw new TypeError("Cannot call a class as a function");
    }function isPowerOfTwo(x) {
      return 0 !== x && !(x & x - 1);
    }Object.defineProperty(exports, "__esModule", { value: !0 });var _createClass = function () {
      function defineProperties(target, props) {
        for (var i = 0; i < props.length; i++) {
          var descriptor = props[i];descriptor.enumerable = descriptor.enumerable || !1, descriptor.configurable = !0, "value" in descriptor && (descriptor.writable = !0), Object.defineProperty(target, descriptor.key, descriptor);
        }
      }return function (Constructor, protoProps, staticProps) {
        return protoProps && defineProperties(Constructor.prototype, protoProps), staticProps && defineProperties(Constructor, staticProps), Constructor;
      };
    }(),
        _GLTool = __webpack_require__(0),
        _GLTool2 = _interopRequireDefault(_GLTool),
        _GLTexture = __webpack_require__(52),
        _GLTexture2 = _interopRequireDefault(_GLTexture),
        gl = void 0,
        MultisampleFrameBuffer = function () {
      function MultisampleFrameBuffer(mWidth, mHeight) {
        var mParameters = arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : {};_classCallCheck(this, MultisampleFrameBuffer), gl = _GLTool2.default.gl, this.width = mWidth, this.height = mHeight, this.magFilter = mParameters.magFilter || gl.LINEAR, this.minFilter = mParameters.minFilter || gl.LINEAR, this.wrapS = mParameters.wrapS || gl.CLAMP_TO_EDGE, this.wrapT = mParameters.wrapT || gl.CLAMP_TO_EDGE, this.useDepth = mParameters.useDepth || !0, this.useStencil = mParameters.useStencil || !1, this.texelType = mParameters.type, this._numSample = mParameters.numSample || 8, isPowerOfTwo(this.width) && isPowerOfTwo(this.height) || (this.wrapS = this.wrapT = gl.CLAMP_TO_EDGE, this.minFilter === gl.LINEAR_MIPMAP_NEAREST && (this.minFilter = gl.LINEAR)), this._init();
      }return _createClass(MultisampleFrameBuffer, [{ key: "_init", value: function value() {
          var texelType = gl.UNSIGNED_BYTE;this.texelType && (texelType = this.texelType), this.texelType = texelType, this.frameBuffer = gl.createFramebuffer(), this.frameBufferColor = gl.createFramebuffer(), this.renderBufferColor = gl.createRenderbuffer(), this.renderBufferDepth = gl.createRenderbuffer(), this.glTexture = this._createTexture(), this.glDepthTexture = this._createTexture(gl.DEPTH_COMPONENT16, gl.UNSIGNED_SHORT, gl.DEPTH_COMPONENT, !0), gl.bindRenderbuffer(gl.RENDERBUFFER, this.renderBufferColor), gl.renderbufferStorageMultisample(gl.RENDERBUFFER, this._numSample, gl.RGBA8, this.width, this.height), gl.bindRenderbuffer(gl.RENDERBUFFER, this.renderBufferDepth), gl.renderbufferStorageMultisample(gl.RENDERBUFFER, this._numSample, gl.DEPTH_COMPONENT16, this.width, this.height), gl.bindFramebuffer(gl.FRAMEBUFFER, this.frameBuffer), gl.framebufferRenderbuffer(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.RENDERBUFFER, this.renderBufferColor), gl.framebufferRenderbuffer(gl.FRAMEBUFFER, gl.DEPTH_ATTACHMENT, gl.RENDERBUFFER, this.renderBufferDepth), gl.bindFramebuffer(gl.FRAMEBUFFER, null), gl.bindFramebuffer(gl.FRAMEBUFFER, this.frameBufferColor), gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, this.glTexture.texture, 0), gl.bindFramebuffer(gl.FRAMEBUFFER, null);
        } }, { key: "_createTexture", value: function value(mInternalformat, mTexelType, mFormat) {
          var forceNearest = arguments.length > 3 && void 0 !== arguments[3] && arguments[3];void 0 === mInternalformat && (mInternalformat = gl.RGBA), void 0 === mTexelType && (mTexelType = this.texelType), mFormat || (mFormat = mInternalformat);var t = gl.createTexture(),
              glt = new _GLTexture2.default(t, !0),
              magFilter = forceNearest ? _GLTool2.default.NEAREST : this.magFilter,
              minFilter = forceNearest ? _GLTool2.default.NEAREST : this.minFilter;return gl.bindTexture(gl.TEXTURE_2D, t), gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, magFilter), gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, minFilter), gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, this.wrapS), gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, this.wrapT), gl.texImage2D(gl.TEXTURE_2D, 0, mInternalformat, this.width, this.height, 0, mFormat, mTexelType, null), gl.bindTexture(gl.TEXTURE_2D, null), glt;
        } }, { key: "bind", value: function value() {
          (!(arguments.length > 0 && void 0 !== arguments[0]) || arguments[0]) && _GLTool2.default.viewport(0, 0, this.width, this.height), gl.bindFramebuffer(gl.FRAMEBUFFER, this.frameBuffer);
        } }, { key: "unbind", value: function value() {
          (!(arguments.length > 0 && void 0 !== arguments[0]) || arguments[0]) && _GLTool2.default.viewport(0, 0, _GLTool2.default.width, _GLTool2.default.height);var width = this.width,
              height = this.height;gl.bindFramebuffer(gl.FRAMEBUFFER, null), gl.bindFramebuffer(gl.READ_FRAMEBUFFER, this.frameBuffer), gl.bindFramebuffer(gl.DRAW_FRAMEBUFFER, this.frameBufferColor), gl.clearBufferfv(gl.COLOR, 0, [0, 0, 0, 0]), gl.blitFramebuffer(0, 0, width, height, 0, 0, width, height, gl.COLOR_BUFFER_BIT, _GLTool2.default.NEAREST), gl.bindFramebuffer(gl.FRAMEBUFFER, null);
        } }, { key: "getTexture", value: function value() {
          arguments.length > 0 && void 0 !== arguments[0] && arguments[0];return this.glTexture;
        } }, { key: "getDepthTexture", value: function value() {
          return this.glDepthTexture;
        } }]), MultisampleFrameBuffer;
    }();exports.default = MultisampleFrameBuffer;
  }, function (module, exports, __webpack_require__) {
    "use strict";
    function _interopRequireDefault(obj) {
      return obj && obj.__esModule ? obj : { default: obj };
    }function _classCallCheck(instance, Constructor) {
      if (!(instance instanceof Constructor)) throw new TypeError("Cannot call a class as a function");
    }function isPowerOfTwo(x) {
      return 0 !== x && !(x & x - 1);
    }function isSourcePowerOfTwo(obj) {
      var w = obj.width || obj.videoWidth,
          h = obj.height || obj.videoHeight;return !(!w || !h) && isPowerOfTwo(w) && isPowerOfTwo(h);
    }Object.defineProperty(exports, "__esModule", { value: !0 });var _createClass = function () {
      function defineProperties(target, props) {
        for (var i = 0; i < props.length; i++) {
          var descriptor = props[i];descriptor.enumerable = descriptor.enumerable || !1, descriptor.configurable = !0, "value" in descriptor && (descriptor.writable = !0), Object.defineProperty(target, descriptor.key, descriptor);
        }
      }return function (Constructor, protoProps, staticProps) {
        return protoProps && defineProperties(Constructor.prototype, protoProps), staticProps && defineProperties(Constructor, staticProps), Constructor;
      };
    }(),
        _GLTool = __webpack_require__(0),
        _GLTool2 = _interopRequireDefault(_GLTool),
        _WebglNumber = __webpack_require__(7),
        gl = (_interopRequireDefault(_WebglNumber), void 0),
        GLTexture = function () {
      function GLTexture(mSource) {
        var isTexture = arguments.length > 1 && void 0 !== arguments[1] && arguments[1],
            mParameters = arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : {};if (_classCallCheck(this, GLTexture), gl = _GLTool2.default.gl, isTexture) this._texture = mSource;else {
          this._mSource = mSource, this._texture = gl.createTexture(), this._isVideo = "VIDEO" === mSource.tagName, this._premultiplyAlpha = !0, this._magFilter = mParameters.magFilter || gl.LINEAR, this._minFilter = mParameters.minFilter || gl.NEAREST_MIPMAP_LINEAR, this._wrapS = mParameters.wrapS || gl.MIRRORED_REPEAT, this._wrapT = mParameters.wrapT || gl.MIRRORED_REPEAT;mSource.width || mSource.videoWidth ? isSourcePowerOfTwo(mSource) || (this._wrapS = this._wrapT = gl.CLAMP_TO_EDGE, this._minFilter === gl.NEAREST_MIPMAP_LINEAR && (this._minFilter = gl.LINEAR)) : (this._wrapS = this._wrapT = gl.CLAMP_TO_EDGE, this._minFilter === gl.NEAREST_MIPMAP_LINEAR && (this._minFilter = gl.LINEAR)), gl.bindTexture(gl.TEXTURE_2D, this._texture), gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, !0), mSource.exposure ? gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, mSource.shape[0], mSource.shape[1], 0, gl.RGBA, gl.FLOAT, mSource.data) : gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, mSource), gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, this._magFilter), gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, this._minFilter), gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, this._wrapS), gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, this._wrapT);var ext = _GLTool2.default.getExtension("EXT_texture_filter_anisotropic");if (ext) {
            var max = gl.getParameter(ext.MAX_TEXTURE_MAX_ANISOTROPY_EXT);gl.texParameterf(gl.TEXTURE_2D, ext.TEXTURE_MAX_ANISOTROPY_EXT, max);
          }this._canGenerateMipmap() && gl.generateMipmap(gl.TEXTURE_2D), gl.bindTexture(gl.TEXTURE_2D, null);
        }
      }return _createClass(GLTexture, [{ key: "generateMipmap", value: function value() {
          this._canGenerateMipmap() && (gl.bindTexture(gl.TEXTURE_2D, this._texture), gl.generateMipmap(gl.TEXTURE_2D), gl.bindTexture(gl.TEXTURE_2D, null));
        } }, { key: "updateTexture", value: function value(mSource) {
          mSource && (this._mSource = mSource), gl.bindTexture(gl.TEXTURE_2D, this._texture), gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, !0), gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, this._mSource), gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, this._magFilter), gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, this._minFilter), this._canGenerateMipmap() && gl.generateMipmap(gl.TEXTURE_2D), gl.bindTexture(gl.TEXTURE_2D, null);
        } }, { key: "bind", value: function value(index) {
          void 0 === index && (index = 0), _GLTool2.default.shader && (gl.activeTexture(gl.TEXTURE0 + index), gl.bindTexture(gl.TEXTURE_2D, this._texture), this._bindIndex = index);
        } }, { key: "_canGenerateMipmap", value: function value() {
          return this._minFilter === gl.LINEAR_MIPMAP_NEAREST || this._minFilter === gl.NEAREST_MIPMAP_LINEAR || this._minFilter === gl.LINEAR_MIPMAP_LINEAR || this._minFilter === gl.NEAREST_MIPMAP_NEAREST;
        } }, { key: "minFilter", set: function set(mValue) {
          if (mValue !== gl.LINEAR && mValue !== gl.NEAREST && mValue !== gl.NEAREST_MIPMAP_LINEAR && mValue !== gl.NEAREST_MIPMAP_LINEAR && mValue !== gl.LINEAR_MIPMAP_LINEAR && mValue !== gl.NEAREST_MIPMAP_NEAREST) return this;this._minFilter = mValue, gl.bindTexture(gl.TEXTURE_2D, this._texture), gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, this._minFilter), gl.bindTexture(gl.TEXTURE_2D, null);
        }, get: function get() {
          return this._minFilter;
        } }, { key: "magFilter", set: function set(mValue) {
          if (mValue !== gl.LINEAR && mValue !== gl.NEAREST) return this;this._magFilter = mValue, gl.bindTexture(gl.TEXTURE_2D, this._texture), gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, this._magFilter), gl.bindTexture(gl.TEXTURE_2D, null);
        }, get: function get() {
          return this._magFilter;
        } }, { key: "wrapS", set: function set(mValue) {
          if (mValue !== gl.CLAMP_TO_EDGE && mValue !== gl.REPEAT && mValue !== gl.MIRRORED_REPEAT) return this;this._wrapS = mValue, gl.bindTexture(gl.TEXTURE_2D, this._texture), gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, this._wrapS), gl.bindTexture(gl.TEXTURE_2D, null);
        }, get: function get() {
          return this._wrapS;
        } }, { key: "wrapT", set: function set(mValue) {
          if (mValue !== gl.CLAMP_TO_EDGE && mValue !== gl.REPEAT && mValue !== gl.MIRRORED_REPEAT) return this;this._wrapT = mValue, gl.bindTexture(gl.TEXTURE_2D, this._texture), gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, this._wrapT), gl.bindTexture(gl.TEXTURE_2D, null);
        }, get: function get() {
          return this._wrapT;
        } }, { key: "premultiplyAlpha", set: function set(mValue) {
          this._premultiplyAlpha = mValue, gl.bindTexture(gl.TEXTURE_2D, this._texture), console.log("premultiplyAlpha:", mValue), gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, this._premultiplyAlpha), gl.bindTexture(gl.TEXTURE_2D, null);
        }, get: function get() {
          return this._premultiplyAlpha;
        } }, { key: "texture", get: function get() {
          return this._texture;
        } }]), GLTexture;
    }(),
        _whiteTexture = void 0,
        _greyTexture = void 0,
        _blackTexture = void 0;GLTexture.whiteTexture = function () {
      if (void 0 === _whiteTexture) {
        var canvas = document.createElement("canvas");canvas.width = canvas.height = 4;var ctx = canvas.getContext("2d");ctx.fillStyle = "#fff", ctx.fillRect(0, 0, 4, 4), _whiteTexture = new GLTexture(canvas);
      }return _whiteTexture;
    }, GLTexture.greyTexture = function () {
      if (void 0 === _greyTexture) {
        var canvas = document.createElement("canvas");canvas.width = canvas.height = 4;var ctx = canvas.getContext("2d");ctx.fillStyle = "rgb(127, 127, 127)", ctx.fillRect(0, 0, 4, 4), _greyTexture = new GLTexture(canvas);
      }return _greyTexture;
    }, GLTexture.blackTexture = function () {
      if (void 0 === _blackTexture) {
        var canvas = document.createElement("canvas");canvas.width = canvas.height = 4;var ctx = canvas.getContext("2d");ctx.fillStyle = "rgb(127, 127, 127)", ctx.fillRect(0, 0, 4, 4), _blackTexture = new GLTexture(canvas);
      }return _blackTexture;
    }, exports.default = GLTexture;
  }, function (module, exports, __webpack_require__) {
    "use strict";
    function _interopRequireDefault(obj) {
      return obj && obj.__esModule ? obj : { default: obj };
    }function _classCallCheck(instance, Constructor) {
      if (!(instance instanceof Constructor)) throw new TypeError("Cannot call a class as a function");
    }Object.defineProperty(exports, "__esModule", { value: !0 });var _createClass = function () {
      function defineProperties(target, props) {
        for (var i = 0; i < props.length; i++) {
          var descriptor = props[i];descriptor.enumerable = descriptor.enumerable || !1, descriptor.configurable = !0, "value" in descriptor && (descriptor.writable = !0), Object.defineProperty(target, descriptor.key, descriptor);
        }
      }return function (Constructor, protoProps, staticProps) {
        return protoProps && defineProperties(Constructor.prototype, protoProps), staticProps && defineProperties(Constructor, staticProps), Constructor;
      };
    }(),
        _GLTool = __webpack_require__(0),
        _GLTool2 = _interopRequireDefault(_GLTool),
        _GLShader = __webpack_require__(1),
        _GLShader2 = _interopRequireDefault(_GLShader),
        _Mesh = __webpack_require__(5),
        _Mesh2 = _interopRequireDefault(_Mesh),
        gl = void 0,
        TransformFeedbackObject = function () {
      function TransformFeedbackObject(strVertexShader, strFragmentShader) {
        _classCallCheck(this, TransformFeedbackObject), gl = _GLTool2.default.gl, this._vs = strVertexShader, this._fs = strFragmentShader, this._init();
      }return _createClass(TransformFeedbackObject, [{ key: "_init", value: function value() {
          this._meshCurrent = new _Mesh2.default(), this._meshTarget = new _Mesh2.default(), this._numPoints = -1, this._varyings = [], this.transformFeedback = gl.createTransformFeedback();
        } }, { key: "bufferData", value: function value(mData, mName, mVaryingName) {
          var isTransformFeedback = !!mVaryingName;console.log("is Transform feedback ?", mName, isTransformFeedback), this._meshCurrent.bufferData(mData, mName, null, gl.STREAM_COPY, !1), this._meshTarget.bufferData(mData, mName, null, gl.STREAM_COPY, !1), isTransformFeedback && (this._varyings.push(mVaryingName), this._numPoints < 0 && (this._numPoints = mData.length));
        } }, { key: "bufferIndex", value: function value(mArrayIndices) {
          this._meshCurrent.bufferIndex(mArrayIndices), this._meshTarget.bufferIndex(mArrayIndices);
        } }, { key: "uniform", value: function value(mName, mType, mValue) {
          this.shader && this.shader.uniform(mName, mType, mValue);
        } }, { key: "generate", value: function value() {
          this.shader = new _GLShader2.default(this._vs, this._fs, this._varyings);
        } }, { key: "render", value: function value() {
          this.shader || this.generate(), this.shader.bind(), _GLTool2.default.drawTransformFeedback(this), this._swap();
        } }, { key: "_swap", value: function value() {
          var tmp = this._meshCurrent;this._meshCurrent = this._meshTarget, this._meshTarget = tmp;
        } }, { key: "numPoints", get: function get() {
          return this._numPoints;
        } }, { key: "meshCurrent", get: function get() {
          return this._meshCurrent;
        } }, { key: "meshTarget", get: function get() {
          return this._meshTarget;
        } }, { key: "meshSource", get: function get() {
          return this._meshCurrent;
        } }, { key: "meshDestination", get: function get() {
          return this._meshTarget;
        } }]), TransformFeedbackObject;
    }();exports.default = TransformFeedbackObject;
  }, function (module, exports, __webpack_require__) {
    "use strict";
    function _classCallCheck(instance, Constructor) {
      if (!(instance instanceof Constructor)) throw new TypeError("Cannot call a class as a function");
    }Object.defineProperty(exports, "__esModule", { value: !0 });var _createClass = function () {
      function defineProperties(target, props) {
        for (var i = 0; i < props.length; i++) {
          var descriptor = props[i];descriptor.enumerable = descriptor.enumerable || !1, descriptor.configurable = !0, "value" in descriptor && (descriptor.writable = !0), Object.defineProperty(target, descriptor.key, descriptor);
        }
      }return function (Constructor, protoProps, staticProps) {
        return protoProps && defineProperties(Constructor.prototype, protoProps), staticProps && defineProperties(Constructor, staticProps), Constructor;
      };
    }(),
        _scheduling = __webpack_require__(4),
        _scheduling2 = function (obj) {
      return obj && obj.__esModule ? obj : { default: obj };
    }(_scheduling),
        SpringNumber = function () {
      function SpringNumber(mValue) {
        var _this = this,
            mSpeed = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : .1,
            mDecreaseRate = arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : .9;_classCallCheck(this, SpringNumber), this._value = mValue, this._targetValue = mValue, this.speed = mSpeed, this.decreaseRate = mDecreaseRate, this._velocity = 0, this._efIndex = _scheduling2.default.addEF(function () {
          return _this._update();
        });
      }return _createClass(SpringNumber, [{ key: "_update", value: function value() {
          if (this._checkLimit(), Math.abs(this._targetValue - this._value) < 1e-4) return void (this._value = this._targetValue);this._velocity += (this._targetValue - this._value) * this.speed, this._value += this._velocity, this._velocity *= this.decreaseRate, Math.abs(this._targetValue - this._value) < 1e-4 && (this._value = this._targetValue);
        } }, { key: "limit", value: function value(mMin, mMax) {
          if (mMin > mMax) return void this.limit(mMax, mMin);this._min = mMin, this._max = mMax, this._checkLimit();
        } }, { key: "_checkLimit", value: function value() {
          void 0 !== this._min && this._targetValue < this._min && (this._targetValue = this._min), void 0 !== this._max && this._targetValue > this._max && (this._targetValue = this._max);
        } }, { key: "destroy", value: function value() {
          _scheduling2.default.removeEF(this._efIndex);
        } }, { key: "value", set: function set(mValue) {
          this._targetValue = mValue;
        }, get: function get() {
          return this._value;
        } }]), SpringNumber;
    }();exports.default = SpringNumber;
  }, function (module, exports, __webpack_require__) {
    "use strict";
    function _classCallCheck(instance, Constructor) {
      if (!(instance instanceof Constructor)) throw new TypeError("Cannot call a class as a function");
    }function getFunc(mEasing) {
      switch (mEasing) {default:case "linear":
          return Easing.Linear.None;case "expIn":
          return Easing.Exponential.In;case "expOut":
          return Easing.Exponential.Out;case "expInOut":
          return Easing.Exponential.InOut;case "cubicIn":
          return Easing.Cubic.In;case "cubicOut":
          return Easing.Cubic.Out;case "cubicInOut":
          return Easing.Cubic.InOut;case "quarticIn":
          return Easing.Quartic.In;case "quarticOut":
          return Easing.Quartic.Out;case "quarticInOut":
          return Easing.Quartic.InOut;case "quinticIn":
          return Easing.Quintic.In;case "quinticOut":
          return Easing.Quintic.Out;case "quinticInOut":
          return Easing.Quintic.InOut;case "sinusoidalIn":
          return Easing.Sinusoidal.In;case "sinusoidalOut":
          return Easing.Sinusoidal.Out;case "sinusoidalInOut":
          return Easing.Sinusoidal.InOut;case "circularIn":
          return Easing.Circular.In;case "circularOut":
          return Easing.Circular.Out;case "circularInOut":
          return Easing.Circular.InOut;case "elasticIn":
          return Easing.Elastic.In;case "elasticOut":
          return Easing.Elastic.Out;case "elasticInOut":
          return Easing.Elastic.InOut;case "backIn":
          return Easing.Back.In;case "backOut":
          return Easing.Back.Out;case "backInOut":
          return Easing.Back.InOut;case "bounceIn":
          return Easing.Bounce.in;case "bounceOut":
          return Easing.Bounce.out;case "bounceInOut":
          return Easing.Bounce.inOut;}
    }Object.defineProperty(exports, "__esModule", { value: !0 });var _createClass = function () {
      function defineProperties(target, props) {
        for (var i = 0; i < props.length; i++) {
          var descriptor = props[i];descriptor.enumerable = descriptor.enumerable || !1, descriptor.configurable = !0, "value" in descriptor && (descriptor.writable = !0), Object.defineProperty(target, descriptor.key, descriptor);
        }
      }return function (Constructor, protoProps, staticProps) {
        return protoProps && defineProperties(Constructor.prototype, protoProps), staticProps && defineProperties(Constructor, staticProps), Constructor;
      };
    }(),
        _scheduling = __webpack_require__(4),
        _scheduling2 = function (obj) {
      return obj && obj.__esModule ? obj : { default: obj };
    }(_scheduling),
        Easing = { Linear: { None: function None(k) {
          return k;
        } }, Quadratic: { In: function In(k) {
          return k * k;
        }, Out: function Out(k) {
          return k * (2 - k);
        }, InOut: function InOut(k) {
          return (k *= 2) < 1 ? .5 * k * k : -.5 * (--k * (k - 2) - 1);
        } }, Cubic: { In: function In(k) {
          return k * k * k;
        }, Out: function Out(k) {
          return --k * k * k + 1;
        }, InOut: function InOut(k) {
          return (k *= 2) < 1 ? .5 * k * k * k : .5 * ((k -= 2) * k * k + 2);
        } }, Quartic: { In: function In(k) {
          return k * k * k * k;
        }, Out: function Out(k) {
          return 1 - --k * k * k * k;
        }, InOut: function InOut(k) {
          return (k *= 2) < 1 ? .5 * k * k * k * k : -.5 * ((k -= 2) * k * k * k - 2);
        } }, Quintic: { In: function In(k) {
          return k * k * k * k * k;
        }, Out: function Out(k) {
          return --k * k * k * k * k + 1;
        }, InOut: function InOut(k) {
          return (k *= 2) < 1 ? .5 * k * k * k * k * k : .5 * ((k -= 2) * k * k * k * k + 2);
        } }, Sinusoidal: { In: function In(k) {
          return 1 - Math.cos(k * Math.PI / 2);
        }, Out: function Out(k) {
          return Math.sin(k * Math.PI / 2);
        }, InOut: function InOut(k) {
          return .5 * (1 - Math.cos(Math.PI * k));
        } }, Exponential: { In: function In(k) {
          return 0 === k ? 0 : Math.pow(1024, k - 1);
        }, Out: function Out(k) {
          return 1 === k ? 1 : 1 - Math.pow(2, -10 * k);
        }, InOut: function InOut(k) {
          return 0 === k ? 0 : 1 === k ? 1 : (k *= 2) < 1 ? .5 * Math.pow(1024, k - 1) : .5 * (2 - Math.pow(2, -10 * (k - 1)));
        } }, Circular: { In: function In(k) {
          return 1 - Math.sqrt(1 - k * k);
        }, Out: function Out(k) {
          return Math.sqrt(1 - --k * k);
        }, InOut: function InOut(k) {
          return (k *= 2) < 1 ? -.5 * (Math.sqrt(1 - k * k) - 1) : .5 * (Math.sqrt(1 - (k -= 2) * k) + 1);
        } }, Elastic: { In: function In(k) {
          var s = void 0,
              a = .1;return 0 === k ? 0 : 1 === k ? 1 : (!a || a < 1 ? (a = 1, s = .1) : s = .4 * Math.asin(1 / a) / (2 * Math.PI), -a * Math.pow(2, 10 * (k -= 1)) * Math.sin((k - s) * (2 * Math.PI) / .4));
        }, Out: function Out(k) {
          var s = void 0,
              a = .1;return 0 === k ? 0 : 1 === k ? 1 : (!a || a < 1 ? (a = 1, s = .1) : s = .4 * Math.asin(1 / a) / (2 * Math.PI), a * Math.pow(2, -10 * k) * Math.sin((k - s) * (2 * Math.PI) / .4) + 1);
        }, InOut: function InOut(k) {
          var s = void 0,
              a = .1;return 0 === k ? 0 : 1 === k ? 1 : (!a || a < 1 ? (a = 1, s = .1) : s = .4 * Math.asin(1 / a) / (2 * Math.PI), (k *= 2) < 1 ? a * Math.pow(2, 10 * (k -= 1)) * Math.sin((k - s) * (2 * Math.PI) / .4) * -.5 : a * Math.pow(2, -10 * (k -= 1)) * Math.sin((k - s) * (2 * Math.PI) / .4) * .5 + 1);
        } }, Back: { In: function In(k) {
          var s = 1.70158;return k * k * ((s + 1) * k - s);
        }, Out: function Out(k) {
          var s = 1.70158;return --k * k * ((s + 1) * k + s) + 1;
        }, InOut: function InOut(k) {
          var s = 2.5949095;return (k *= 2) < 1 ? k * k * ((s + 1) * k - s) * .5 : .5 * ((k -= 2) * k * ((s + 1) * k + s) + 2);
        } }, Bounce: { in: function _in(k) {
          return 1 - Easing.Bounce.out(1 - k);
        }, out: function out(k) {
          return k < 1 / 2.75 ? 7.5625 * k * k : k < 2 / 2.75 ? 7.5625 * (k -= 1.5 / 2.75) * k + .75 : k < 2.5 / 2.75 ? 7.5625 * (k -= 2.25 / 2.75) * k + .9375 : 7.5625 * (k -= 2.625 / 2.75) * k + .984375;
        }, inOut: function inOut(k) {
          return k < .5 ? .5 * Easing.Bounce.in(2 * k) : .5 * Easing.Bounce.out(2 * k - 1) + .5;
        } } },
        TweenNumber = function () {
      function TweenNumber(mValue) {
        var _this = this,
            mEasing = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : "expOut",
            mSpeed = arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : .01;_classCallCheck(this, TweenNumber), this._value = mValue, this._startValue = mValue, this._targetValue = mValue, this._counter = 1, this.speed = mSpeed, this.easing = mEasing, this._needUpdate = !0, this._efIndex = _scheduling2.default.addEF(function () {
          return _this._update();
        });
      }return _createClass(TweenNumber, [{ key: "_update", value: function value() {
          var newCounter = this._counter + this.speed;if (newCounter > 1 && (newCounter = 1), this._counter === newCounter) return void (this._needUpdate = !1);this._counter = newCounter, this._needUpdate = !0;
        } }, { key: "limit", value: function value(mMin, mMax) {
          if (mMin > mMax) return void this.limit(mMax, mMin);this._min = mMin, this._max = mMax, this._checkLimit();
        } }, { key: "setTo", value: function value(mValue) {
          this._value = mValue, this._targetValue = mValue, this._counter = 1;
        } }, { key: "_checkLimit", value: function value() {
          void 0 !== this._min && this._targetValue < this._min && (this._targetValue = this._min), void 0 !== this._max && this._targetValue > this._max && (this._targetValue = this._max);
        } }, { key: "destroy", value: function value() {
          _scheduling2.default.removeEF(this._efIndex);
        } }, { key: "value", set: function set(mValue) {
          this._startValue = this._value, this._targetValue = mValue, this._checkLimit(), this._counter = 0;
        }, get: function get() {
          if (this._needUpdate) {
            var f = getFunc(this.easing),
                p = f(this._counter);this._value = this._startValue + p * (this._targetValue - this._startValue), this._needUpdate = !1;
          }return this._value;
        } }, { key: "targetValue", get: function get() {
          return this._targetValue;
        } }]), TweenNumber;
    }();exports.default = TweenNumber;
  }, function (module, exports, __webpack_require__) {
    "use strict";
    function _interopRequireDefault(obj) {
      return obj && obj.__esModule ? obj : { default: obj };
    }function _classCallCheck(instance, Constructor) {
      if (!(instance instanceof Constructor)) throw new TypeError("Cannot call a class as a function");
    }Object.defineProperty(exports, "__esModule", { value: !0 });var _createClass = function () {
      function defineProperties(target, props) {
        for (var i = 0; i < props.length; i++) {
          var descriptor = props[i];descriptor.enumerable = descriptor.enumerable || !1, descriptor.configurable = !0, "value" in descriptor && (descriptor.writable = !0), Object.defineProperty(target, descriptor.key, descriptor);
        }
      }return function (Constructor, protoProps, staticProps) {
        return protoProps && defineProperties(Constructor.prototype, protoProps), staticProps && defineProperties(Constructor, staticProps), Constructor;
      };
    }(),
        _glMatrix = __webpack_require__(2),
        _EaseNumber = __webpack_require__(10),
        _EaseNumber2 = _interopRequireDefault(_EaseNumber),
        _scheduling = __webpack_require__(4),
        _scheduling2 = _interopRequireDefault(_scheduling),
        getMouse = function getMouse(mEvent, mTarget) {
      var o = mTarget || {};return mEvent.touches ? (o.x = mEvent.touches[0].pageX, o.y = mEvent.touches[0].pageY) : (o.x = mEvent.clientX, o.y = mEvent.clientY), o;
    },
        QuatRotation = function () {
      function QuatRotation(mTarget) {
        var _this = this,
            mListenerTarget = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : window,
            mEasing = arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : .1;_classCallCheck(this, QuatRotation), this._target = mTarget, this._listenerTarget = mListenerTarget, this.matrix = _glMatrix.mat4.create(), this.m = _glMatrix.mat4.create(), this._vZaxis = _glMatrix.vec3.clone([0, 0, 0]), this._zAxis = _glMatrix.vec3.clone([0, 0, 1]), this.preMouse = { x: 0, y: 0 }, this.mouse = { x: 0, y: 0 }, this._isMouseDown = !1, this._rotation = _glMatrix.quat.create(), this.tempRotation = _glMatrix.quat.create(), this._rotateZMargin = 0, this._offset = .004, this._slerp = -1, this._isLocked = !1, this._diffX = new _EaseNumber2.default(0, mEasing), this._diffY = new _EaseNumber2.default(0, mEasing), this._listenerTarget.addEventListener("mousedown", function (e) {
          return _this._onDown(e);
        }), this._listenerTarget.addEventListener("touchstart", function (e) {
          return _this._onDown(e);
        }), this._listenerTarget.addEventListener("mousemove", function (e) {
          return _this._onMove(e);
        }), this._listenerTarget.addEventListener("touchmove", function (e) {
          return _this._onMove(e);
        }), window.addEventListener("touchend", function () {
          return _this._onUp();
        }), window.addEventListener("mouseup", function () {
          return _this._onUp();
        }), _scheduling2.default.addEF(function () {
          return _this._loop();
        });
      }return _createClass(QuatRotation, [{ key: "inverseControl", value: function value() {
          var isInvert = !(arguments.length > 0 && void 0 !== arguments[0]) || arguments[0];this._isInvert = isInvert;
        } }, { key: "lock", value: function value() {
          var mValue = !(arguments.length > 0 && void 0 !== arguments[0]) || arguments[0];this._isLocked = mValue;
        } }, { key: "setCameraPos", value: function value(mQuat) {
          var speed = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : .1;if (this.easing = speed, !(this._slerp > 0)) {
            var tempRotation = _glMatrix.quat.clone(this._rotation);this._updateRotation(tempRotation), this._rotation = _glMatrix.quat.clone(tempRotation), this._currDiffX = this.diffX = 0, this._currDiffY = this.diffY = 0, this._isMouseDown = !1, this._isRotateZ = 0, this._targetQuat = _glMatrix.quat.clone(mQuat), this._slerp = 1;
          }
        } }, { key: "resetQuat", value: function value() {
          this._rotation = _glMatrix.quat.clone([0, 0, 1, 0]), this.tempRotation = _glMatrix.quat.clone([0, 0, 0, 0]), this._targetQuat = void 0, this._slerp = -1;
        } }, { key: "_onDown", value: function value(mEvent) {
          if (!this._isLocked) {
            var mouse = getMouse(mEvent),
                tempRotation = _glMatrix.quat.clone(this._rotation);this._updateRotation(tempRotation), this._rotation = tempRotation, this._isMouseDown = !0, this._isRotateZ = 0, this.preMouse = { x: mouse.x, y: mouse.y }, mouse.y < this._rotateZMargin || mouse.y > window.innerHeight - this._rotateZMargin ? this._isRotateZ = 1 : (mouse.x < this._rotateZMargin || mouse.x > window.innerWidth - this._rotateZMargin) && (this._isRotateZ = 2), this._diffX.setTo(0), this._diffY.setTo(0);
          }
        } }, { key: "_onMove", value: function value(mEvent) {
          this._isLocked || getMouse(mEvent, this.mouse);
        } }, { key: "_onUp", value: function value() {
          this._isLocked || (this._isMouseDown = !1);
        } }, { key: "_updateRotation", value: function value(mTempRotation) {
          this._isMouseDown && !this._isLocked && (this._diffX.value = -(this.mouse.x - this.preMouse.x), this._diffY.value = this.mouse.y - this.preMouse.y, this._isInvert && (this._diffX.value = -this._diffX.targetValue, this._diffY.value = -this._diffY.targetValue));var angle = void 0,
              _quat = void 0;if (this._isRotateZ > 0) 1 === this._isRotateZ ? (angle = -this._diffX.value * this._offset, angle *= this.preMouse.y < this._rotateZMargin ? -1 : 1, _quat = _glMatrix.quat.clone([0, 0, Math.sin(angle), Math.cos(angle)]), _glMatrix.quat.multiply(_quat, mTempRotation, _quat)) : (angle = -this._diffY.value * this._offset, angle *= this.preMouse.x < this._rotateZMargin ? 1 : -1, _quat = _glMatrix.quat.clone([0, 0, Math.sin(angle), Math.cos(angle)]), _glMatrix.quat.multiply(_quat, mTempRotation, _quat));else {
            var v = _glMatrix.vec3.clone([this._diffX.value, this._diffY.value, 0]),
                axis = _glMatrix.vec3.create();_glMatrix.vec3.cross(axis, v, this._zAxis), _glMatrix.vec3.normalize(axis, axis), angle = _glMatrix.vec3.length(v) * this._offset, _quat = _glMatrix.quat.clone([Math.sin(angle) * axis[0], Math.sin(angle) * axis[1], Math.sin(angle) * axis[2], Math.cos(angle)]), _glMatrix.quat.multiply(mTempRotation, _quat, mTempRotation);
          }
        } }, { key: "_loop", value: function value() {
          _glMatrix.mat4.identity(this.m), void 0 === this._targetQuat ? (_glMatrix.quat.set(this.tempRotation, this._rotation[0], this._rotation[1], this._rotation[2], this._rotation[3]), this._updateRotation(this.tempRotation)) : (this._slerp += .1 * (0 - this._slerp), this._slerp < 5e-4 ? (_glMatrix.quat.copy(this._rotation, this._targetQuat), _glMatrix.quat.copy(this.tempRotation, this._targetQuat), this._targetQuat = void 0, this._diffX.setTo(0), this._diffY.setTo(0), this._slerp = -1) : (_glMatrix.quat.set(this.tempRotation, 0, 0, 0, 0), _glMatrix.quat.slerp(this.tempRotation, this._targetQuat, this._rotation, this._slerp))), _glMatrix.vec3.transformQuat(this._vZaxis, this._vZaxis, this.tempRotation), _glMatrix.mat4.fromQuat(this.matrix, this.tempRotation);
        } }, { key: "easing", set: function set(mValue) {
          this._diffX.easing = mValue, this._diffY.easing = mValue;
        }, get: function get() {
          return this._diffX.easing;
        } }]), QuatRotation;
    }();exports.default = QuatRotation;
  }, function (module, exports, __webpack_require__) {
    "use strict";
    function _interopRequireDefault(obj) {
      return obj && obj.__esModule ? obj : { default: obj };
    }function _classCallCheck(instance, Constructor) {
      if (!(instance instanceof Constructor)) throw new TypeError("Cannot call a class as a function");
    }function _possibleConstructorReturn(self, call) {
      if (!self) throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return !call || "object" != (typeof call === "undefined" ? "undefined" : _typeof2(call)) && "function" != typeof call ? self : call;
    }function _inherits(subClass, superClass) {
      if ("function" != typeof superClass && null !== superClass) throw new TypeError("Super expression must either be null or a function, not " + (typeof superClass === "undefined" ? "undefined" : _typeof2(superClass)));subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: !1, writable: !0, configurable: !0 } }), superClass && (Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass);
    }function distance(a, b) {
      var dx = a.x - b.x,
          dy = a.y - b.y;return Math.sqrt(dx * dx + dy * dy);
    }Object.defineProperty(exports, "__esModule", { value: !0 });var _createClass = function () {
      function defineProperties(target, props) {
        for (var i = 0; i < props.length; i++) {
          var descriptor = props[i];descriptor.enumerable = descriptor.enumerable || !1, descriptor.configurable = !0, "value" in descriptor && (descriptor.writable = !0), Object.defineProperty(target, descriptor.key, descriptor);
        }
      }return function (Constructor, protoProps, staticProps) {
        return protoProps && defineProperties(Constructor.prototype, protoProps), staticProps && defineProperties(Constructor, staticProps), Constructor;
      };
    }(),
        _GLTool = __webpack_require__(0),
        _GLTool2 = _interopRequireDefault(_GLTool),
        _EventDispatcher2 = __webpack_require__(26),
        _EventDispatcher3 = _interopRequireDefault(_EventDispatcher2),
        _Ray = __webpack_require__(11),
        _Ray2 = _interopRequireDefault(_Ray),
        _getMouse = __webpack_require__(58),
        _getMouse2 = _interopRequireDefault(_getMouse),
        TouchDetector = function (_EventDispatcher) {
      function TouchDetector(mMesh, mCamera) {
        var mSkipMoveCheck = arguments.length > 2 && void 0 !== arguments[2] && arguments[2],
            mListenerTarget = arguments.length > 3 && void 0 !== arguments[3] ? arguments[3] : window;_classCallCheck(this, TouchDetector);var _this = _possibleConstructorReturn(this, (TouchDetector.__proto__ || Object.getPrototypeOf(TouchDetector)).call(this));return _this._mesh = mMesh, _this._mesh.generateFaces(), _this._camera = mCamera, _this.faceVertices = mMesh.faces.map(function (face) {
          return face.vertices;
        }), _this.clickTolerance = 8, _this._ray = new _Ray2.default([0, 0, 0], [0, 0, -1]), _this._hit = vec3.fromValues(-999, -999, -999), _this._lastPos, _this._firstPos, _this.mtxModel = mat4.create(), _this._listenerTarget = mListenerTarget, _this._skippingMove = mSkipMoveCheck, _this._onMoveBind = function (e) {
          return _this._onMove(e);
        }, _this._onDownBind = function (e) {
          return _this._onDown(e);
        }, _this._onUpBind = function () {
          return _this._onUp();
        }, _this.connect(), _this;
      }return _inherits(TouchDetector, _EventDispatcher), _createClass(TouchDetector, [{ key: "connect", value: function value() {
          this._listenerTarget.addEventListener("mousedown", this._onDownBind), this._listenerTarget.addEventListener("mousemove", this._onMoveBind), this._listenerTarget.addEventListener("mouseup", this._onUpBind);
        } }, { key: "disconnect", value: function value() {
          this._listenerTarget.removeEventListener("mousedown", this._onDownBind), this._listenerTarget.removeEventListener("mousemove", this._onMoveBind), this._listenerTarget.removeEventListener("mouseup", this._onUpBind);
        } }, { key: "_checkHit", value: function value() {
          var _this2 = this,
              mType = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : "onHit",
              camera = this._camera;if (camera) {
            var mx = this._lastPos.x / _GLTool2.default.width * 2 - 1,
                my = -this._lastPos.y / _GLTool2.default.height * 2 + 1;camera.generateRay([mx, my, 0], this._ray);for (var hit = void 0, v0 = vec3.create(), v1 = vec3.create(), v2 = vec3.create(), dist = 0, getVector = function getVector(v, target) {
              vec3.transformMat4(target, v, _this2.mtxModel);
            }, i = 0; i < this.faceVertices.length; i++) {
              var vertices = this.faceVertices[i];getVector(vertices[0], v0), getVector(vertices[1], v1), getVector(vertices[2], v2);var t = this._ray.intersectTriangle(v0, v1, v2);if (t) if (hit) {
                var distToCam = vec3.dist(t, camera.position);distToCam < dist && (hit = vec3.clone(t), dist = distToCam);
              } else hit = vec3.clone(t), dist = vec3.dist(hit, camera.position);
            }hit ? (this._hit = vec3.clone(hit), this.dispatchCustomEvent(mType, { hit: hit })) : this.dispatchCustomEvent("onUp");
          }
        } }, { key: "_onDown", value: function value(e) {
          this._firstPos = (0, _getMouse2.default)(e), this._lastPos = (0, _getMouse2.default)(e), this._checkHit("onDown");
        } }, { key: "_onMove", value: function value(e) {
          this._lastPos = (0, _getMouse2.default)(e), this._skippingMove || this._checkHit();
        } }, { key: "_onUp", value: function value() {
          distance(this._firstPos, this._lastPos) < this.clickTolerance && this._checkHit();
        } }]), TouchDetector;
    }(_EventDispatcher3.default);exports.default = TouchDetector;
  }, function (module, exports, __webpack_require__) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: !0 }), exports.default = function (e) {
      var x = void 0,
          y = void 0;return e.touches ? (x = e.touches[0].pageX, y = e.touches[0].pageY) : (x = e.clientX, y = e.clientY), { x: x, y: y };
    };
  }, function (module, exports, __webpack_require__) {
    "use strict";
    function _classCallCheck(instance, Constructor) {
      if (!(instance instanceof Constructor)) throw new TypeError("Cannot call a class as a function");
    }function _possibleConstructorReturn(self, call) {
      if (!self) throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return !call || "object" != (typeof call === "undefined" ? "undefined" : _typeof2(call)) && "function" != typeof call ? self : call;
    }function _inherits(subClass, superClass) {
      if ("function" != typeof superClass && null !== superClass) throw new TypeError("Super expression must either be null or a function, not " + (typeof superClass === "undefined" ? "undefined" : _typeof2(superClass)));subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: !1, writable: !0, configurable: !0 } }), superClass && (Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass);
    }Object.defineProperty(exports, "__esModule", { value: !0 });var _createClass = function () {
      function defineProperties(target, props) {
        for (var i = 0; i < props.length; i++) {
          var descriptor = props[i];descriptor.enumerable = descriptor.enumerable || !1, descriptor.configurable = !0, "value" in descriptor && (descriptor.writable = !0), Object.defineProperty(target, descriptor.key, descriptor);
        }
      }return function (Constructor, protoProps, staticProps) {
        return protoProps && defineProperties(Constructor.prototype, protoProps), staticProps && defineProperties(Constructor, staticProps), Constructor;
      };
    }(),
        _CameraPerspective2 = __webpack_require__(13),
        _CameraPerspective3 = function (obj) {
      return obj && obj.__esModule ? obj : { default: obj };
    }(_CameraPerspective2),
        _glMatrix = __webpack_require__(2),
        CAMERA_SETTINGS = [[_glMatrix.vec3.fromValues(0, 0, 0), _glMatrix.vec3.fromValues(1, 0, 0), _glMatrix.vec3.fromValues(0, -1, 0)], [_glMatrix.vec3.fromValues(0, 0, 0), _glMatrix.vec3.fromValues(-1, 0, 0), _glMatrix.vec3.fromValues(0, -1, 0)], [_glMatrix.vec3.fromValues(0, 0, 0), _glMatrix.vec3.fromValues(0, 1, 0), _glMatrix.vec3.fromValues(0, 0, 1)], [_glMatrix.vec3.fromValues(0, 0, 0), _glMatrix.vec3.fromValues(0, -1, 0), _glMatrix.vec3.fromValues(0, 0, -1)], [_glMatrix.vec3.fromValues(0, 0, 0), _glMatrix.vec3.fromValues(0, 0, 1), _glMatrix.vec3.fromValues(0, -1, 0)], [_glMatrix.vec3.fromValues(0, 0, 0), _glMatrix.vec3.fromValues(0, 0, -1), _glMatrix.vec3.fromValues(0, -1, 0)]],
        CameraCube = function (_CameraPerspective) {
      function CameraCube() {
        _classCallCheck(this, CameraCube);var _this = _possibleConstructorReturn(this, (CameraCube.__proto__ || Object.getPrototypeOf(CameraCube)).call(this));return _this.setPerspective(Math.PI / 2, 1, .1, 1e3), _this;
      }return _inherits(CameraCube, _CameraPerspective), _createClass(CameraCube, [{ key: "face", value: function value(mIndex) {
          var o = CAMERA_SETTINGS[mIndex];this.lookAt(o[0], o[1], o[2]);
        } }]), CameraCube;
    }(_CameraPerspective3.default);exports.default = CameraCube;
  }, function (module, exports, __webpack_require__) {
    "use strict";
    function _interopRequireDefault(obj) {
      return obj && obj.__esModule ? obj : { default: obj };
    }function _classCallCheck(instance, Constructor) {
      if (!(instance instanceof Constructor)) throw new TypeError("Cannot call a class as a function");
    }function _possibleConstructorReturn(self, call) {
      if (!self) throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return !call || "object" != (typeof call === "undefined" ? "undefined" : _typeof2(call)) && "function" != typeof call ? self : call;
    }function _inherits(subClass, superClass) {
      if ("function" != typeof superClass && null !== superClass) throw new TypeError("Super expression must either be null or a function, not " + (typeof superClass === "undefined" ? "undefined" : _typeof2(superClass)));subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: !1, writable: !0, configurable: !0 } }), superClass && (Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass);
    }Object.defineProperty(exports, "__esModule", { value: !0 });var _createClass = function () {
      function defineProperties(target, props) {
        for (var i = 0; i < props.length; i++) {
          var descriptor = props[i];descriptor.enumerable = descriptor.enumerable || !1, descriptor.configurable = !0, "value" in descriptor && (descriptor.writable = !0), Object.defineProperty(target, descriptor.key, descriptor);
        }
      }return function (Constructor, protoProps, staticProps) {
        return protoProps && defineProperties(Constructor.prototype, protoProps), staticProps && defineProperties(Constructor, staticProps), Constructor;
      };
    }(),
        _get = function get(object, property, receiver) {
      null === object && (object = Function.prototype);var desc = Object.getOwnPropertyDescriptor(object, property);if (void 0 === desc) {
        var parent = Object.getPrototypeOf(object);return null === parent ? void 0 : get(parent, property, receiver);
      }if ("value" in desc) return desc.value;var getter = desc.get;if (void 0 !== getter) return getter.call(receiver);
    },
        _BinaryLoader2 = __webpack_require__(14),
        _BinaryLoader3 = _interopRequireDefault(_BinaryLoader2),
        _Mesh = __webpack_require__(5),
        _Mesh2 = _interopRequireDefault(_Mesh),
        ObjLoader = function (_BinaryLoader) {
      function ObjLoader() {
        return _classCallCheck(this, ObjLoader), _possibleConstructorReturn(this, (ObjLoader.__proto__ || Object.getPrototypeOf(ObjLoader)).apply(this, arguments));
      }return _inherits(ObjLoader, _BinaryLoader), _createClass(ObjLoader, [{ key: "load", value: function value(url, callback) {
          var drawType = arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : 4;this._drawType = drawType, _get(ObjLoader.prototype.__proto__ || Object.getPrototypeOf(ObjLoader.prototype), "load", this).call(this, url, callback);
        } }, { key: "_onLoaded", value: function value() {
          this.parseObj(this._req.response);
        } }, { key: "parseObj", value: function value(objStr) {
          function parseVertexIndex(value) {
            var index = parseInt(value);return 3 * (index >= 0 ? index - 1 : index + vertices.length / 3);
          }function parseNormalIndex(value) {
            var index = parseInt(value);return 3 * (index >= 0 ? index - 1 : index + normals.length / 3);
          }function parseUVIndex(value) {
            var index = parseInt(value);return 2 * (index >= 0 ? index - 1 : index + uvs.length / 2);
          }function addVertex(a, b, c) {
            positions.push([vertices[a], vertices[a + 1], vertices[a + 2]]), positions.push([vertices[b], vertices[b + 1], vertices[b + 2]]), positions.push([vertices[c], vertices[c + 1], vertices[c + 2]]), indices.push(3 * count + 0), indices.push(3 * count + 1), indices.push(3 * count + 2), count++;
          }function addUV(a, b, c) {
            coords.push([uvs[a], uvs[a + 1]]), coords.push([uvs[b], uvs[b + 1]]), coords.push([uvs[c], uvs[c + 1]]);
          }function addNormal(a, b, c) {
            finalNormals.push([normals[a], normals[a + 1], normals[a + 2]]), finalNormals.push([normals[b], normals[b + 1], normals[b + 2]]), finalNormals.push([normals[c], normals[c + 1], normals[c + 2]]);
          }function addFace(a, b, c, d, ua, ub, uc, ud, na, nb, nc, nd) {
            var ia = parseVertexIndex(a),
                ib = parseVertexIndex(b),
                ic = parseVertexIndex(c),
                id = void 0;void 0 === d ? addVertex(ia, ib, ic) : (id = parseVertexIndex(d), addVertex(ia, ib, id), addVertex(ib, ic, id)), void 0 !== ua && (ia = parseUVIndex(ua), ib = parseUVIndex(ub), ic = parseUVIndex(uc), void 0 === d ? addUV(ia, ib, ic) : (id = parseUVIndex(ud), addUV(ia, ib, id), addUV(ib, ic, id))), void 0 !== na && (ia = parseNormalIndex(na), ib = parseNormalIndex(nb), ic = parseNormalIndex(nc), void 0 === d ? addNormal(ia, ib, ic) : (id = parseNormalIndex(nd), addNormal(ia, ib, id), addNormal(ib, ic, id)));
          }for (var lines = objStr.split("\n"), positions = [], coords = [], finalNormals = [], vertices = [], normals = [], uvs = [], indices = [], count = 0, result = void 0, vertexPattern = /v( +[\d|\.|\+|\-|e|E]+)( +[\d|\.|\+|\-|e|E]+)( +[\d|\.|\+|\-|e|E]+)/, normalPattern = /vn( +[\d|\.|\+|\-|e|E]+)( +[\d|\.|\+|\-|e|E]+)( +[\d|\.|\+|\-|e|E]+)/, uvPattern = /vt( +[\d|\.|\+|\-|e|E]+)( +[\d|\.|\+|\-|e|E]+)/, facePattern1 = /f( +-?\d+)( +-?\d+)( +-?\d+)( +-?\d+)?/, facePattern2 = /f( +(-?\d+)\/(-?\d+))( +(-?\d+)\/(-?\d+))( +(-?\d+)\/(-?\d+))( +(-?\d+)\/(-?\d+))?/, facePattern3 = /f( +(-?\d+)\/(-?\d+)\/(-?\d+))( +(-?\d+)\/(-?\d+)\/(-?\d+))( +(-?\d+)\/(-?\d+)\/(-?\d+))( +(-?\d+)\/(-?\d+)\/(-?\d+))?/, facePattern4 = /f( +(-?\d+)\/\/(-?\d+))( +(-?\d+)\/\/(-?\d+))( +(-?\d+)\/\/(-?\d+))( +(-?\d+)\/\/(-?\d+))?/, i = 0; i < lines.length; i++) {
            var line = lines[i];line = line.trim(), 0 !== line.length && "#" !== line.charAt(0) && (null !== (result = vertexPattern.exec(line)) ? vertices.push(parseFloat(result[1]), parseFloat(result[2]), parseFloat(result[3])) : null !== (result = normalPattern.exec(line)) ? normals.push(parseFloat(result[1]), parseFloat(result[2]), parseFloat(result[3])) : null !== (result = uvPattern.exec(line)) ? uvs.push(parseFloat(result[1]), parseFloat(result[2])) : null !== (result = facePattern1.exec(line)) ? addFace(result[1], result[2], result[3], result[4]) : null !== (result = facePattern2.exec(line)) ? addFace(result[2], result[5], result[8], result[11], result[3], result[6], result[9], result[12]) : null !== (result = facePattern3.exec(line)) ? addFace(result[2], result[6], result[10], result[14], result[3], result[7], result[11], result[15], result[4], result[8], result[12], result[16]) : null !== (result = facePattern4.exec(line)) && addFace(result[2], result[5], result[8], result[11], void 0, void 0, void 0, void 0, result[3], result[6], result[9], result[12]));
          }return this._generateMeshes({ positions: positions, coords: coords, normals: finalNormals, indices: indices });
        } }, { key: "_generateMeshes", value: function value(o) {
          var hasNormals = o.normals.length > 0,
              hasUVs = o.coords.length > 0,
              mesh = void 0;if (o.positions.length > 65535) {
            var meshes = [],
                lastIndex = 0,
                oCopy = {};for (oCopy.positions = o.positions.concat(), oCopy.coords = o.coords.concat(), oCopy.indices = o.indices.concat(), oCopy.normals = o.normals.concat(); o.indices.length > 0;) {
              for (var sliceNum = Math.min(65535, o.positions.length), indices = o.indices.splice(0, sliceNum), positions = [], coords = [], normals = [], index = void 0, tmpIndex = 0, i = 0; i < indices.length; i++) {
                indices[i] > tmpIndex && (tmpIndex = indices[i]), index = indices[i], positions.push(oCopy.positions[index]), hasUVs && coords.push(oCopy.coords[index]), hasNormals && normals.push(oCopy.normals[index]), indices[i] -= lastIndex;
              }lastIndex = tmpIndex + 1, mesh = new _Mesh2.default(this._drawType), mesh.bufferVertex(positions), hasUVs && mesh.bufferTexCoord(coords), mesh.bufferIndex(indices), hasNormals && mesh.bufferNormal(normals), meshes.push(mesh);
            }return this._callback && this._callback(meshes, oCopy), meshes;
          }return mesh = new _Mesh2.default(this._drawType), mesh.bufferVertex(o.positions), hasUVs && mesh.bufferTexCoord(o.coords), mesh.bufferIndex(o.indices), hasNormals && mesh.bufferNormal(o.normals), this._callback && this._callback(mesh, o), mesh;
        } }]), ObjLoader;
    }(_BinaryLoader3.default);ObjLoader.parse = function (objStr) {
      return new ObjLoader().parseObj(objStr);
    }, exports.default = ObjLoader;
  }, function (module, exports, __webpack_require__) {
    "use strict";
    function _interopRequireDefault(obj) {
      return obj && obj.__esModule ? obj : { default: obj };
    }function _classCallCheck(instance, Constructor) {
      if (!(instance instanceof Constructor)) throw new TypeError("Cannot call a class as a function");
    }function _possibleConstructorReturn(self, call) {
      if (!self) throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return !call || "object" != (typeof call === "undefined" ? "undefined" : _typeof2(call)) && "function" != typeof call ? self : call;
    }function _inherits(subClass, superClass) {
      if ("function" != typeof superClass && null !== superClass) throw new TypeError("Super expression must either be null or a function, not " + (typeof superClass === "undefined" ? "undefined" : _typeof2(superClass)));subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: !1, writable: !0, configurable: !0 } }), superClass && (Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass);
    }Object.defineProperty(exports, "__esModule", { value: !0 });var _createClass = function () {
      function defineProperties(target, props) {
        for (var i = 0; i < props.length; i++) {
          var descriptor = props[i];descriptor.enumerable = descriptor.enumerable || !1, descriptor.configurable = !0, "value" in descriptor && (descriptor.writable = !0), Object.defineProperty(target, descriptor.key, descriptor);
        }
      }return function (Constructor, protoProps, staticProps) {
        return protoProps && defineProperties(Constructor.prototype, protoProps), staticProps && defineProperties(Constructor, staticProps), Constructor;
      };
    }(),
        _BinaryLoader2 = __webpack_require__(14),
        _BinaryLoader3 = _interopRequireDefault(_BinaryLoader2),
        _HDRParser = __webpack_require__(62),
        _HDRParser2 = _interopRequireDefault(_HDRParser),
        HDRLoader = function (_BinaryLoader) {
      function HDRLoader() {
        return _classCallCheck(this, HDRLoader), _possibleConstructorReturn(this, (HDRLoader.__proto__ || Object.getPrototypeOf(HDRLoader)).call(this, !0));
      }return _inherits(HDRLoader, _BinaryLoader), _createClass(HDRLoader, [{ key: "parse", value: function value(mArrayBuffer) {
          return (0, _HDRParser2.default)(mArrayBuffer);
        } }, { key: "_onLoaded", value: function value() {
          var o = this.parse(this._req.response);this._callback && this._callback(o);
        } }]), HDRLoader;
    }(_BinaryLoader3.default);HDRLoader.parse = function (mArrayBuffer) {
      return (0, _HDRParser2.default)(mArrayBuffer);
    }, exports.default = HDRLoader;
  }, function (module, exports, __webpack_require__) {
    "use strict";
    function readPixelsRawRLE(buffer, data, offset, fileOffset, scanlineWidth, numScanlines) {
      function readBuf(buf) {
        var bytesRead = 0;do {
          buf[bytesRead++] = buffer[fileOffset];
        } while (++fileOffset < bufferLength && bytesRead < buf.length);return bytesRead;
      }function readBufOffset(buf, offset, length) {
        var bytesRead = 0;do {
          buf[offset + bytesRead++] = buffer[fileOffset];
        } while (++fileOffset < bufferLength && bytesRead < length);return bytesRead;
      }for (var rgbe = new Array(4), scanlineBuffer = null, ptr = void 0, ptrEnd = void 0, count = void 0, buf = new Array(2), bufferLength = buffer.length; numScanlines > 0;) {
        if (readBuf(rgbe) < rgbe.length) throw new Error("Error reading bytes: expected " + rgbe.length);if (2 !== rgbe[0] || 2 !== rgbe[1] || 0 != (128 & rgbe[2])) return data[offset++] = rgbe[0], data[offset++] = rgbe[1], data[offset++] = rgbe[2], data[offset++] = rgbe[3], void function (buffer, data, offset, numpixels) {
          var numExpected = 4 * numpixels,
              numRead = readBufOffset(data, offset, numExpected);if (numRead < numExpected) throw new Error("Error reading raw pixels: got " + numRead + " bytes, expected " + numExpected);
        }(0, data, offset, scanlineWidth * numScanlines - 1);if (((255 & rgbe[2]) << 8 | 255 & rgbe[3]) !== scanlineWidth) throw new Error("Wrong scanline width " + ((255 & rgbe[2]) << 8 | 255 & rgbe[3]) + ", expected " + scanlineWidth);null === scanlineBuffer && (scanlineBuffer = new Array(4 * scanlineWidth)), ptr = 0;for (var i = 0; i < 4; i++) {
          for (ptrEnd = (i + 1) * scanlineWidth; ptr < ptrEnd;) {
            if (readBuf(buf) < buf.length) throw new Error("Error reading 2-byte buffer");if ((255 & buf[0]) > 128) {
              if (0 === (count = (255 & buf[0]) - 128) || count > ptrEnd - ptr) throw new Error("Bad scanline data");for (; count-- > 0;) {
                scanlineBuffer[ptr++] = buf[1];
              }
            } else {
              if (0 === (count = 255 & buf[0]) || count > ptrEnd - ptr) throw new Error("Bad scanline data");if (scanlineBuffer[ptr++] = buf[1], --count > 0) {
                if (readBufOffset(scanlineBuffer, ptr, count) < count) throw new Error("Error reading non-run data");ptr += count;
              }
            }
          }
        }for (var _i = 0; _i < scanlineWidth; _i++) {
          data[offset + 0] = scanlineBuffer[_i], data[offset + 1] = scanlineBuffer[_i + scanlineWidth], data[offset + 2] = scanlineBuffer[_i + 2 * scanlineWidth], data[offset + 3] = scanlineBuffer[_i + 3 * scanlineWidth], offset += 4;
        }numScanlines--;
      }
    }function parseHdr(buffer) {
      buffer instanceof ArrayBuffer && (buffer = new Uint8Array(buffer));for (var fileOffset = 0, bufferLength = buffer.length, NEW_LINE = 10, width = 0, height = 0, exposure = 1, rle = !1, i = 0; i < 20; i++) {
        var line = function () {
          var buf = "";do {
            var b = buffer[fileOffset];if (b === NEW_LINE) {
              ++fileOffset;break;
            }buf += String.fromCharCode(b);
          } while (++fileOffset < bufferLength);return buf;
        }(),
            match = void 0;if (match = line.match(radiancePattern)) ;else if (match = line.match(formatPattern)) rle = !0;else if (match = line.match(exposurePattern)) exposure = Number(match[1]);else if (match = line.match(commentPattern)) ;else if (match = line.match(widthHeightPattern)) {
          height = Number(match[1]), width = Number(match[2]);break;
        }
      }if (!rle) throw new Error("File is not run length encoded!");var data = new Uint8Array(width * height * 4);readPixelsRawRLE(buffer, data, 0, fileOffset, width, height);for (var floatData = new Float32Array(width * height * 4), offset = 0; offset < data.length; offset += 4) {
        var r = data[offset + 0] / 255,
            g = data[offset + 1] / 255,
            b = data[offset + 2] / 255,
            e = data[offset + 3],
            f = Math.pow(2, e - 128);r *= f, g *= f, b *= f;var floatOffset = offset;floatData[floatOffset + 0] = r, floatData[floatOffset + 1] = g, floatData[floatOffset + 2] = b, floatData[floatOffset + 3] = 1;
      }return { shape: [width, height], exposure: exposure, gamma: 1, data: floatData };
    }Object.defineProperty(exports, "__esModule", { value: !0 });var radiancePattern = "#\\?RADIANCE",
        commentPattern = "#.*",
        exposurePattern = "EXPOSURE=\\s*([0-9]*[.][0-9]*)",
        formatPattern = "FORMAT=32-bit_rle_rgbe",
        widthHeightPattern = "-Y ([0-9]+) \\+X ([0-9]+)";exports.default = parseHdr;
  }, function (module, exports, __webpack_require__) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: !0 });var _Mesh = __webpack_require__(5),
        _Mesh2 = function (obj) {
      return obj && obj.__esModule ? obj : { default: obj };
    }(_Mesh),
        ARRAY_CTOR_MAP = { 5120: Int8Array, 5121: Uint8Array, 5122: Int16Array, 5123: Uint16Array, 5125: Uint32Array, 5126: Float32Array },
        SIZE_MAP = { SCALAR: 1, VEC2: 2, VEC3: 3, VEC4: 4, MAT2: 4, MAT3: 9, MAT4: 16 },
        semanticAttributeMap = { NORMAL: "aNormal", POSITION: "aVertexPosition", TEXCOORD_0: "aTextureCoord", WEIGHTS_0: "aWeight", JOINTS_0: "aJoint", COLOR: "aColor" },
        parse = function parse(gltf, bin) {
      return new Promise(function (resolve, reject) {
        gltf.output = { meshes: [], scenes: [], textures: [] }, _getBufferViewData(gltf, bin).then(_parseMesh).then(function (gltfInfo) {
          resolve(gltfInfo);
        }).catch(function (e) {
          console.log("Error:", e);
        });
      });
    },
        _getBufferViewData = function _getBufferViewData(gltfInfo, bin) {
      return new Promise(function (resolve, reject) {
        var bufferViews = gltfInfo.bufferViews;gltfInfo.buffers;bufferViews.forEach(function (bufferViewInfo, i) {
          var buffer = bin;bufferViewInfo.data = buffer.slice(bufferViewInfo.byteOffset || 0, (bufferViewInfo.byteOffset || 0) + (bufferViewInfo.byteLength || 0));
        }), resolve(gltfInfo);
      });
    },
        _parseMesh = function _parseMesh(gltf) {
      return new Promise(function (resolve, reject) {
        var meshes = gltf.meshes;gltf.geometries = [], meshes.forEach(function (mesh, i) {
          var primitives = mesh.primitives,
              geometry = {};primitives.forEach(function (primitiveInfo, i) {
            var semantics = Object.keys(primitiveInfo.attributes),
                defines = {};if (semantics.forEach(function (semantic, i) {
              var accessorIdx = primitiveInfo.attributes[semantic],
                  attributeInfo = gltf.accessors[accessorIdx],
                  attributeName = semanticAttributeMap[semantic];if (attributeName) {
                "NORMAL" === semantic && (defines.HAS_NORMALS = 1), semantic.indexOf("TEXCOORD") > -1 && (defines.HAS_UV = 1);var size = SIZE_MAP[attributeInfo.type],
                    attributeArray = _getAccessorData(gltf, accessorIdx);attributeArray instanceof Uint32Array && (attributeArray = new Float32Array(attributeArray)), "TEXCOORD_1" === semantic && console.log(size, attributeArray), geometry[attributeName] = { value: attributeArray, size: size };
              }
            }), null != primitiveInfo.indices) {
              var attributeArray = _getAccessorData(gltf, primitiveInfo.indices, !0);geometry.indices = { value: attributeArray, size: 1 };
            }var m = new _Mesh2.default();for (var s in geometry) {
              var data = geometry[s];"indices" !== s ? m.bufferFlattenData(data.value, s, data.size) : m.bufferIndex(data.value);
            }if (gltf.output.meshes.push(m), primitiveInfo.material) {
              console.log("gltf.output", gltf.output, primitiveInfo.material);var material = gltf.output.materials[primitiveInfo.material];m.material = material, defines = objectAssign(defines, m.material.defines), m.defines = defines;var shader = Shaders.get(ShaderLibs.gltfVert, ShaderLibs.gltfFrag, defines),
                  emissiveFacotr = material.emissiveFacotr,
                  normalTexture = material.normalTexture,
                  occlusionTexture = material.occlusionTexture,
                  pbrMetallicRoughness = material.pbrMetallicRoughness,
                  baseColorTexture = pbrMetallicRoughness.baseColorTexture,
                  metallicRoughnessTexture = pbrMetallicRoughness.metallicRoughnessTexture,
                  uniforms = { uEmissiveFactor: emissiveFacotr || [0, 0, 0], uBaseColor: pbrMetallicRoughness.baseColorFactor || [1, 1, 1, 1], uRoughness: pbrMetallicRoughness.roughnessFactor || 1, uMetallic: pbrMetallicRoughness.metallicFactor || 1, uScaleDiffBaseMR: [0, 0, 0, 0], uScaleFGDSpec: [0, 0, 0, 0], uScaleIBLAmbient: [1, 1, 1, 1], uLightDirection: [1, 1, 1], uLightColor: [1, 1, 1], uGamma: 1 };baseColorTexture && (uniforms.uColorMap = baseColorTexture.glTexture), metallicRoughnessTexture && (uniforms.uMetallicRoughnessMap = metallicRoughnessTexture.glTexture), normalTexture && (uniforms.uNormalScale = normalTexture.scale || 1, uniforms.uNormalMap = normalTexture.glTexture), occlusionTexture && (uniforms.uAoMap = occlusionTexture.glTexture, uniforms.uOcclusionStrength = occlusionTexture.strength || 1), shader.bind(), shader.uniform(uniforms), m.material.shader = shader, m.material.uniforms = uniforms;
            }gltf.geometries.push(geometry);
          });
        }), resolve(gltf);
      });
    },
        _getAccessorData = function _getAccessorData(gltf, accessorIdx) {
      var isIndices = arguments.length > 2 && void 0 !== arguments[2] && arguments[2],
          accessorInfo = gltf.accessors[accessorIdx],
          buffer = gltf.bufferViews[accessorInfo.bufferView].data,
          byteOffset = accessorInfo.byteOffset || 0,
          ArrayCtor = ARRAY_CTOR_MAP[accessorInfo.componentType] || Float32Array,
          size = SIZE_MAP[accessorInfo.type];null == size && isIndices && (size = 1);var arr = new ArrayCtor(buffer, byteOffset, size * accessorInfo.count),
          quantizeExtension = accessorInfo.extensions && accessorInfo.extensions.WEB3D_quantized_attributes;if (quantizeExtension) {
        for (var decodedArr = new Float32Array(size * accessorInfo.count), decodeMatrix = quantizeExtension.decodeMatrix, decodeOffset = new Array(size), decodeScale = new Array(size), k = 0; k < size; k++) {
          decodeOffset[k] = decodeMatrix[size * (size + 1) + k], decodeScale[k] = decodeMatrix[k * (size + 1) + k];
        }for (var i = 0; i < accessorInfo.count; i++) {
          for (var _k = 0; _k < size; _k++) {
            decodedArr[i * size + _k] = arr[i * size + _k] * decodeScale[_k] + decodeOffset[_k];
          }
        }arr = decodedArr;
      }return arr;
    };exports.default = { parse: parse };
  }, function (module, exports, __webpack_require__) {
    "use strict";
    function _interopRequireDefault(obj) {
      return obj && obj.__esModule ? obj : { default: obj };
    }function _classCallCheck(instance, Constructor) {
      if (!(instance instanceof Constructor)) throw new TypeError("Cannot call a class as a function");
    }function _possibleConstructorReturn(self, call) {
      if (!self) throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return !call || "object" != (typeof call === "undefined" ? "undefined" : _typeof2(call)) && "function" != typeof call ? self : call;
    }function _inherits(subClass, superClass) {
      if ("function" != typeof superClass && null !== superClass) throw new TypeError("Super expression must either be null or a function, not " + (typeof superClass === "undefined" ? "undefined" : _typeof2(superClass)));subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: !1, writable: !0, configurable: !0 } }), superClass && (Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass);
    }Object.defineProperty(exports, "__esModule", { value: !0 });var _createClass = function () {
      function defineProperties(target, props) {
        for (var i = 0; i < props.length; i++) {
          var descriptor = props[i];descriptor.enumerable = descriptor.enumerable || !1, descriptor.configurable = !0, "value" in descriptor && (descriptor.writable = !0), Object.defineProperty(target, descriptor.key, descriptor);
        }
      }return function (Constructor, protoProps, staticProps) {
        return protoProps && defineProperties(Constructor.prototype, protoProps), staticProps && defineProperties(Constructor, staticProps), Constructor;
      };
    }(),
        _get = function get(object, property, receiver) {
      null === object && (object = Function.prototype);var desc = Object.getOwnPropertyDescriptor(object, property);if (void 0 === desc) {
        var parent = Object.getPrototypeOf(object);return null === parent ? void 0 : get(parent, property, receiver);
      }if ("value" in desc) return desc.value;var getter = desc.get;if (void 0 !== getter) return getter.call(receiver);
    },
        _Geom = __webpack_require__(8),
        _Geom2 = _interopRequireDefault(_Geom),
        _GLShader = __webpack_require__(1),
        _GLShader2 = _interopRequireDefault(_GLShader),
        _Batch2 = __webpack_require__(6),
        _Batch3 = _interopRequireDefault(_Batch2),
        _bigTriangle = __webpack_require__(30),
        _bigTriangle2 = _interopRequireDefault(_bigTriangle),
        _copy = __webpack_require__(15),
        _copy2 = _interopRequireDefault(_copy),
        BatchCopy = function (_Batch) {
      function BatchCopy() {
        _classCallCheck(this, BatchCopy);var mesh = _Geom2.default.bigTriangle(),
            shader = new _GLShader2.default(_bigTriangle2.default, _copy2.default),
            _this = _possibleConstructorReturn(this, (BatchCopy.__proto__ || Object.getPrototypeOf(BatchCopy)).call(this, mesh, shader));return shader.bind(), shader.uniform("texture", "uniform1i", 0), _this;
      }return _inherits(BatchCopy, _Batch), _createClass(BatchCopy, [{ key: "draw", value: function value(texture) {
          this.shader.bind(), texture.bind(0), _get(BatchCopy.prototype.__proto__ || Object.getPrototypeOf(BatchCopy.prototype), "draw", this).call(this);
        } }]), BatchCopy;
    }(_Batch3.default);exports.default = BatchCopy;
  }, function (module, exports, __webpack_require__) {
    "use strict";
    function _interopRequireDefault(obj) {
      return obj && obj.__esModule ? obj : { default: obj };
    }function _classCallCheck(instance, Constructor) {
      if (!(instance instanceof Constructor)) throw new TypeError("Cannot call a class as a function");
    }function _possibleConstructorReturn(self, call) {
      if (!self) throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return !call || "object" != (typeof call === "undefined" ? "undefined" : _typeof2(call)) && "function" != typeof call ? self : call;
    }function _inherits(subClass, superClass) {
      if ("function" != typeof superClass && null !== superClass) throw new TypeError("Super expression must either be null or a function, not " + (typeof superClass === "undefined" ? "undefined" : _typeof2(superClass)));subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: !1, writable: !0, configurable: !0 } }), superClass && (Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass);
    }Object.defineProperty(exports, "__esModule", { value: !0 });var _GLTool = __webpack_require__(0),
        _GLTool2 = _interopRequireDefault(_GLTool),
        _Mesh = __webpack_require__(5),
        _Mesh2 = _interopRequireDefault(_Mesh),
        _GLShader = __webpack_require__(1),
        _GLShader2 = _interopRequireDefault(_GLShader),
        _Batch2 = __webpack_require__(6),
        _Batch3 = _interopRequireDefault(_Batch2),
        _axis = __webpack_require__(66),
        _axis2 = _interopRequireDefault(_axis),
        _axis3 = __webpack_require__(67),
        _axis4 = _interopRequireDefault(_axis3),
        BatchAxis = function (_Batch) {
      function BatchAxis() {
        _classCallCheck(this, BatchAxis);var positions = [],
            colors = [],
            indices = [0, 1, 2, 3, 4, 5],
            r = 9999;positions.push([-r, 0, 0]), positions.push([r, 0, 0]), positions.push([0, -r, 0]), positions.push([0, r, 0]), positions.push([0, 0, -r]), positions.push([0, 0, r]), colors.push([1, 0, 0]), colors.push([1, 0, 0]), colors.push([0, 1, 0]), colors.push([0, 1, 0]), colors.push([0, 0, 1]), colors.push([0, 0, 1]);var mesh = new _Mesh2.default(_GLTool2.default.LINES);mesh.bufferVertex(positions), mesh.bufferIndex(indices), mesh.bufferData(colors, "aColor", 3);var shader = new _GLShader2.default(_axis2.default, _axis4.default);return _possibleConstructorReturn(this, (BatchAxis.__proto__ || Object.getPrototypeOf(BatchAxis)).call(this, mesh, shader));
      }return _inherits(BatchAxis, _Batch), BatchAxis;
    }(_Batch3.default);exports.default = BatchAxis;
  }, function (module, exports) {
    module.exports = "// axis.vert\n\n#define SHADER_NAME BASIC_VERTEX\n\nprecision highp float;\n#define GLSLIFY 1\nattribute vec3 aVertexPosition;\nattribute vec3 aColor;\nattribute vec3 aNormal;\n\nuniform mat4 uModelMatrix;\nuniform mat4 uViewMatrix;\nuniform mat4 uProjectionMatrix;\n\nvarying vec3 vColor;\nvarying vec3 vNormal;\n\nvoid main(void) {\n    gl_Position = uProjectionMatrix * uViewMatrix * uModelMatrix * vec4(aVertexPosition, 1.0);\n    vColor = aColor;\n    vNormal = aNormal;\n}";
  }, function (module, exports) {
    module.exports = "// axis.frag\n\n#define SHADER_NAME SIMPLE_TEXTURE\n\nprecision lowp float;\n#define GLSLIFY 1\nvarying vec3 vColor;\nvarying vec3 vNormal;\n\nvoid main(void) {\n\t// vec3 color = vNormal;\n\tvec3 color = vColor + vNormal * 0.0001;\n    gl_FragColor = vec4(color, 1.0);\n}";
  }, function (module, exports, __webpack_require__) {
    "use strict";
    function _interopRequireDefault(obj) {
      return obj && obj.__esModule ? obj : { default: obj };
    }function _classCallCheck(instance, Constructor) {
      if (!(instance instanceof Constructor)) throw new TypeError("Cannot call a class as a function");
    }function _possibleConstructorReturn(self, call) {
      if (!self) throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return !call || "object" != (typeof call === "undefined" ? "undefined" : _typeof2(call)) && "function" != typeof call ? self : call;
    }function _inherits(subClass, superClass) {
      if ("function" != typeof superClass && null !== superClass) throw new TypeError("Super expression must either be null or a function, not " + (typeof superClass === "undefined" ? "undefined" : _typeof2(superClass)));subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: !1, writable: !0, configurable: !0 } }), superClass && (Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass);
    }Object.defineProperty(exports, "__esModule", { value: !0 });var _createClass = function () {
      function defineProperties(target, props) {
        for (var i = 0; i < props.length; i++) {
          var descriptor = props[i];descriptor.enumerable = descriptor.enumerable || !1, descriptor.configurable = !0, "value" in descriptor && (descriptor.writable = !0), Object.defineProperty(target, descriptor.key, descriptor);
        }
      }return function (Constructor, protoProps, staticProps) {
        return protoProps && defineProperties(Constructor.prototype, protoProps), staticProps && defineProperties(Constructor, staticProps), Constructor;
      };
    }(),
        _get = function get(object, property, receiver) {
      null === object && (object = Function.prototype);var desc = Object.getOwnPropertyDescriptor(object, property);if (void 0 === desc) {
        var parent = Object.getPrototypeOf(object);return null === parent ? void 0 : get(parent, property, receiver);
      }if ("value" in desc) return desc.value;var getter = desc.get;if (void 0 !== getter) return getter.call(receiver);
    },
        _Geom = __webpack_require__(8),
        _Geom2 = _interopRequireDefault(_Geom),
        _GLShader = __webpack_require__(1),
        _GLShader2 = _interopRequireDefault(_GLShader),
        _Batch2 = __webpack_require__(6),
        _Batch3 = _interopRequireDefault(_Batch2),
        _general = __webpack_require__(31),
        _general2 = _interopRequireDefault(_general),
        _simpleColor = __webpack_require__(16),
        _simpleColor2 = _interopRequireDefault(_simpleColor),
        BatchBall = function (_Batch) {
      function BatchBall() {
        _classCallCheck(this, BatchBall);var mesh = _Geom2.default.sphere(1, 24),
            shader = new _GLShader2.default(_general2.default, _simpleColor2.default);return _possibleConstructorReturn(this, (BatchBall.__proto__ || Object.getPrototypeOf(BatchBall)).call(this, mesh, shader));
      }return _inherits(BatchBall, _Batch), _createClass(BatchBall, [{ key: "draw", value: function value() {
          var position = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : [0, 0, 0],
              scale = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : [1, 1, 1],
              color = arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : [1, 1, 1],
              opacity = arguments.length > 3 && void 0 !== arguments[3] ? arguments[3] : 1;this.shader.bind(), this.shader.uniform("position", "uniform3fv", position), this.shader.uniform("scale", "uniform3fv", scale), this.shader.uniform("color", "uniform3fv", color), this.shader.uniform("opacity", "uniform1f", opacity), _get(BatchBall.prototype.__proto__ || Object.getPrototypeOf(BatchBall.prototype), "draw", this).call(this);
        } }]), BatchBall;
    }(_Batch3.default);exports.default = BatchBall;
  }, function (module, exports, __webpack_require__) {
    "use strict";
    function _interopRequireDefault(obj) {
      return obj && obj.__esModule ? obj : { default: obj };
    }function _classCallCheck(instance, Constructor) {
      if (!(instance instanceof Constructor)) throw new TypeError("Cannot call a class as a function");
    }function _possibleConstructorReturn(self, call) {
      if (!self) throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return !call || "object" != (typeof call === "undefined" ? "undefined" : _typeof2(call)) && "function" != typeof call ? self : call;
    }function _inherits(subClass, superClass) {
      if ("function" != typeof superClass && null !== superClass) throw new TypeError("Super expression must either be null or a function, not " + (typeof superClass === "undefined" ? "undefined" : _typeof2(superClass)));subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: !1, writable: !0, configurable: !0 } }), superClass && (Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass);
    }Object.defineProperty(exports, "__esModule", { value: !0 });var _createClass = function () {
      function defineProperties(target, props) {
        for (var i = 0; i < props.length; i++) {
          var descriptor = props[i];descriptor.enumerable = descriptor.enumerable || !1, descriptor.configurable = !0, "value" in descriptor && (descriptor.writable = !0), Object.defineProperty(target, descriptor.key, descriptor);
        }
      }return function (Constructor, protoProps, staticProps) {
        return protoProps && defineProperties(Constructor.prototype, protoProps), staticProps && defineProperties(Constructor, staticProps), Constructor;
      };
    }(),
        _get = function get(object, property, receiver) {
      null === object && (object = Function.prototype);var desc = Object.getOwnPropertyDescriptor(object, property);if (void 0 === desc) {
        var parent = Object.getPrototypeOf(object);return null === parent ? void 0 : get(parent, property, receiver);
      }if ("value" in desc) return desc.value;var getter = desc.get;if (void 0 !== getter) return getter.call(receiver);
    },
        _GLTool = __webpack_require__(0),
        _GLTool2 = _interopRequireDefault(_GLTool),
        _Mesh = __webpack_require__(5),
        _Mesh2 = _interopRequireDefault(_Mesh),
        _GLShader = __webpack_require__(1),
        _GLShader2 = _interopRequireDefault(_GLShader),
        _Batch2 = __webpack_require__(6),
        _Batch3 = _interopRequireDefault(_Batch2),
        _dotsPlane = __webpack_require__(70),
        _dotsPlane2 = _interopRequireDefault(_dotsPlane),
        _dotsPlane3 = __webpack_require__(71),
        _dotsPlane4 = _interopRequireDefault(_dotsPlane3),
        BatchDotsPlane = function (_Batch) {
      function BatchDotsPlane() {
        _classCallCheck(this, BatchDotsPlane);var positions = [],
            indices = [],
            index = 0,
            i = void 0,
            j = void 0;for (i = -100; i < 100; i += 1) {
          for (j = -100; j < 100; j += 1) {
            positions.push([i, j, 0]), indices.push(index), index++, positions.push([i, 0, j]), indices.push(index), index++;
          }
        }var mesh = new _Mesh2.default(_GLTool2.default.POINTS);mesh.bufferVertex(positions), mesh.bufferIndex(indices);var shader = new _GLShader2.default(_dotsPlane2.default, _dotsPlane4.default),
            _this = _possibleConstructorReturn(this, (BatchDotsPlane.__proto__ || Object.getPrototypeOf(BatchDotsPlane)).call(this, mesh, shader));return _this.color = [1, 1, 1], _this.opacity = .65, _this;
      }return _inherits(BatchDotsPlane, _Batch), _createClass(BatchDotsPlane, [{ key: "draw", value: function value() {
          this.shader.bind(), this.shader.uniform("color", "uniform3fv", this.color), this.shader.uniform("opacity", "uniform1f", this.opacity), this.shader.uniform("viewport", "vec2", [_GLTool2.default.width, _GLTool2.default.height]), _get(BatchDotsPlane.prototype.__proto__ || Object.getPrototypeOf(BatchDotsPlane.prototype), "draw", this).call(this);
        } }]), BatchDotsPlane;
    }(_Batch3.default);exports.default = BatchDotsPlane;
  }, function (module, exports) {
    module.exports = "// basic.vert\n\n#define SHADER_NAME DOTS_PLANE_VERTEX\n\nprecision highp float;\n#define GLSLIFY 1\nattribute vec3 aVertexPosition;\nattribute vec3 aNormal;\n\nuniform mat4 uModelMatrix;\nuniform mat4 uViewMatrix;\nuniform mat4 uProjectionMatrix;\nuniform vec2 viewport;\n\nvarying vec3 vNormal;\n\nconst float radius = 0.008;\n\nvoid main(void) {\n    gl_Position = uProjectionMatrix * uViewMatrix * uModelMatrix * vec4(aVertexPosition + aNormal * 0.000001, 1.0);\n    // gl_PointSize = 1.0;\n    vNormal = aNormal;\n\n\tfloat distOffset = viewport.y * uProjectionMatrix[1][1] * radius / gl_Position.w;\n    gl_PointSize = distOffset;\n}";
  }, function (module, exports) {
    module.exports = "// dotsPlane.frag\n\nprecision highp float;\n#define GLSLIFY 1\n\nuniform vec3 color;\nuniform float opacity;\n\nvoid main(void) {\n\tif(distance(gl_PointCoord, vec2(.5)) > .5) {\n\t\tdiscard;\n\t}\n    gl_FragColor = vec4(color, opacity);\n}";
  }, function (module, exports, __webpack_require__) {
    "use strict";
    function _interopRequireDefault(obj) {
      return obj && obj.__esModule ? obj : { default: obj };
    }function _classCallCheck(instance, Constructor) {
      if (!(instance instanceof Constructor)) throw new TypeError("Cannot call a class as a function");
    }function _possibleConstructorReturn(self, call) {
      if (!self) throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return !call || "object" != (typeof call === "undefined" ? "undefined" : _typeof2(call)) && "function" != typeof call ? self : call;
    }function _inherits(subClass, superClass) {
      if ("function" != typeof superClass && null !== superClass) throw new TypeError("Super expression must either be null or a function, not " + (typeof superClass === "undefined" ? "undefined" : _typeof2(superClass)));subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: !1, writable: !0, configurable: !0 } }), superClass && (Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass);
    }Object.defineProperty(exports, "__esModule", { value: !0 });var _createClass = function () {
      function defineProperties(target, props) {
        for (var i = 0; i < props.length; i++) {
          var descriptor = props[i];descriptor.enumerable = descriptor.enumerable || !1, descriptor.configurable = !0, "value" in descriptor && (descriptor.writable = !0), Object.defineProperty(target, descriptor.key, descriptor);
        }
      }return function (Constructor, protoProps, staticProps) {
        return protoProps && defineProperties(Constructor.prototype, protoProps), staticProps && defineProperties(Constructor, staticProps), Constructor;
      };
    }(),
        _get = function get(object, property, receiver) {
      null === object && (object = Function.prototype);var desc = Object.getOwnPropertyDescriptor(object, property);if (void 0 === desc) {
        var parent = Object.getPrototypeOf(object);return null === parent ? void 0 : get(parent, property, receiver);
      }if ("value" in desc) return desc.value;var getter = desc.get;if (void 0 !== getter) return getter.call(receiver);
    },
        _GLTool = __webpack_require__(0),
        _GLTool2 = _interopRequireDefault(_GLTool),
        _Mesh = __webpack_require__(5),
        _Mesh2 = _interopRequireDefault(_Mesh),
        _GLShader = __webpack_require__(1),
        _GLShader2 = _interopRequireDefault(_GLShader),
        _Batch2 = __webpack_require__(6),
        _Batch3 = _interopRequireDefault(_Batch2),
        vs = __webpack_require__(9),
        fs = __webpack_require__(16),
        BatchAxis = function (_Batch) {
      function BatchAxis() {
        _classCallCheck(this, BatchAxis);var positions = [],
            indices = [0, 1],
            coords = [[0, 0], [1, 1]];positions.push([0, 0, 0]), positions.push([0, 0, 0]);var mesh = new _Mesh2.default(_GLTool2.default.LINES);mesh.bufferVertex(positions), mesh.bufferTexCoord(coords), mesh.bufferIndex(indices);var shader = new _GLShader2.default(vs, fs);return _possibleConstructorReturn(this, (BatchAxis.__proto__ || Object.getPrototypeOf(BatchAxis)).call(this, mesh, shader));
      }return _inherits(BatchAxis, _Batch), _createClass(BatchAxis, [{ key: "draw", value: function value(mPositionA, mPositionB) {
          var color = arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : [1, 1, 1],
              opacity = arguments.length > 3 && void 0 !== arguments[3] ? arguments[3] : 1;this._mesh.bufferVertex([mPositionA, mPositionB]), this._shader.bind(), this._shader.uniform("color", "vec3", color), this._shader.uniform("opacity", "float", opacity), _get(BatchAxis.prototype.__proto__ || Object.getPrototypeOf(BatchAxis.prototype), "draw", this).call(this);
        } }]), BatchAxis;
    }(_Batch3.default);exports.default = BatchAxis;
  }, function (module, exports, __webpack_require__) {
    "use strict";
    function _interopRequireDefault(obj) {
      return obj && obj.__esModule ? obj : { default: obj };
    }function _classCallCheck(instance, Constructor) {
      if (!(instance instanceof Constructor)) throw new TypeError("Cannot call a class as a function");
    }function _possibleConstructorReturn(self, call) {
      if (!self) throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return !call || "object" != (typeof call === "undefined" ? "undefined" : _typeof2(call)) && "function" != typeof call ? self : call;
    }function _inherits(subClass, superClass) {
      if ("function" != typeof superClass && null !== superClass) throw new TypeError("Super expression must either be null or a function, not " + (typeof superClass === "undefined" ? "undefined" : _typeof2(superClass)));subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: !1, writable: !0, configurable: !0 } }), superClass && (Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass);
    }Object.defineProperty(exports, "__esModule", { value: !0 });var _createClass = function () {
      function defineProperties(target, props) {
        for (var i = 0; i < props.length; i++) {
          var descriptor = props[i];descriptor.enumerable = descriptor.enumerable || !1, descriptor.configurable = !0, "value" in descriptor && (descriptor.writable = !0), Object.defineProperty(target, descriptor.key, descriptor);
        }
      }return function (Constructor, protoProps, staticProps) {
        return protoProps && defineProperties(Constructor.prototype, protoProps), staticProps && defineProperties(Constructor, staticProps), Constructor;
      };
    }(),
        _get = function get(object, property, receiver) {
      null === object && (object = Function.prototype);var desc = Object.getOwnPropertyDescriptor(object, property);if (void 0 === desc) {
        var parent = Object.getPrototypeOf(object);return null === parent ? void 0 : get(parent, property, receiver);
      }if ("value" in desc) return desc.value;var getter = desc.get;if (void 0 !== getter) return getter.call(receiver);
    },
        _Geom = __webpack_require__(8),
        _Geom2 = _interopRequireDefault(_Geom),
        _GLShader = __webpack_require__(1),
        _GLShader2 = _interopRequireDefault(_GLShader),
        _Batch2 = __webpack_require__(6),
        _Batch3 = _interopRequireDefault(_Batch2),
        vs = __webpack_require__(32),
        fs = __webpack_require__(33),
        BatchSkybox = function (_Batch) {
      function BatchSkybox() {
        var size = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : 20;_classCallCheck(this, BatchSkybox);var mesh = _Geom2.default.skybox(size),
            shader = new _GLShader2.default(vs, fs);return _possibleConstructorReturn(this, (BatchSkybox.__proto__ || Object.getPrototypeOf(BatchSkybox)).call(this, mesh, shader));
      }return _inherits(BatchSkybox, _Batch), _createClass(BatchSkybox, [{ key: "draw", value: function value(texture) {
          this.shader.bind(), texture.bind(0), _get(BatchSkybox.prototype.__proto__ || Object.getPrototypeOf(BatchSkybox.prototype), "draw", this).call(this);
        } }]), BatchSkybox;
    }(_Batch3.default);exports.default = BatchSkybox;
  }, function (module, exports, __webpack_require__) {
    "use strict";
    function _interopRequireDefault(obj) {
      return obj && obj.__esModule ? obj : { default: obj };
    }function _classCallCheck(instance, Constructor) {
      if (!(instance instanceof Constructor)) throw new TypeError("Cannot call a class as a function");
    }function _possibleConstructorReturn(self, call) {
      if (!self) throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return !call || "object" != (typeof call === "undefined" ? "undefined" : _typeof2(call)) && "function" != typeof call ? self : call;
    }function _inherits(subClass, superClass) {
      if ("function" != typeof superClass && null !== superClass) throw new TypeError("Super expression must either be null or a function, not " + (typeof superClass === "undefined" ? "undefined" : _typeof2(superClass)));subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: !1, writable: !0, configurable: !0 } }), superClass && (Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass);
    }Object.defineProperty(exports, "__esModule", { value: !0 });var _createClass = function () {
      function defineProperties(target, props) {
        for (var i = 0; i < props.length; i++) {
          var descriptor = props[i];descriptor.enumerable = descriptor.enumerable || !1, descriptor.configurable = !0, "value" in descriptor && (descriptor.writable = !0), Object.defineProperty(target, descriptor.key, descriptor);
        }
      }return function (Constructor, protoProps, staticProps) {
        return protoProps && defineProperties(Constructor.prototype, protoProps), staticProps && defineProperties(Constructor, staticProps), Constructor;
      };
    }(),
        _get = function get(object, property, receiver) {
      null === object && (object = Function.prototype);var desc = Object.getOwnPropertyDescriptor(object, property);if (void 0 === desc) {
        var parent = Object.getPrototypeOf(object);return null === parent ? void 0 : get(parent, property, receiver);
      }if ("value" in desc) return desc.value;var getter = desc.get;if (void 0 !== getter) return getter.call(receiver);
    },
        _Geom = __webpack_require__(8),
        _Geom2 = _interopRequireDefault(_Geom),
        _GLShader = __webpack_require__(1),
        _GLShader2 = _interopRequireDefault(_GLShader),
        _Batch2 = __webpack_require__(6),
        _Batch3 = _interopRequireDefault(_Batch2),
        vs = __webpack_require__(75),
        fs = __webpack_require__(15),
        BatchSky = function (_Batch) {
      function BatchSky() {
        var size = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : 50,
            seg = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : 24;_classCallCheck(this, BatchSky);var mesh = _Geom2.default.sphere(size, seg, !0),
            shader = new _GLShader2.default(vs, fs);return _possibleConstructorReturn(this, (BatchSky.__proto__ || Object.getPrototypeOf(BatchSky)).call(this, mesh, shader));
      }return _inherits(BatchSky, _Batch), _createClass(BatchSky, [{ key: "draw", value: function value(texture) {
          this.shader.bind(), texture.bind(0), _get(BatchSky.prototype.__proto__ || Object.getPrototypeOf(BatchSky.prototype), "draw", this).call(this);
        } }]), BatchSky;
    }(_Batch3.default);exports.default = BatchSky;
  }, function (module, exports) {
    module.exports = "// sky.vert\n\nprecision highp float;\n#define GLSLIFY 1\nattribute vec3 aVertexPosition;\nattribute vec2 aTextureCoord;\nattribute vec3 aNormal;\n\nuniform mat4 uModelMatrix;\nuniform mat4 uViewMatrix;\nuniform mat4 uProjectionMatrix;\n\nvarying vec2 vTextureCoord;\nvarying vec3 vNormal;\n\nvoid main(void) {\n\tmat4 matView = uViewMatrix;\n\tmatView[3][0] = 0.0;\n\tmatView[3][1] = 0.0;\n\tmatView[3][2] = 0.0;\n\t\n    gl_Position = uProjectionMatrix * matView * uModelMatrix * vec4(aVertexPosition, 1.0);\n    vTextureCoord = aTextureCoord;\n    vNormal = aNormal;\n}";
  }, function (module, exports, __webpack_require__) {
    "use strict";
    function _interopRequireDefault(obj) {
      return obj && obj.__esModule ? obj : { default: obj };
    }function _classCallCheck(instance, Constructor) {
      if (!(instance instanceof Constructor)) throw new TypeError("Cannot call a class as a function");
    }Object.defineProperty(exports, "__esModule", { value: !0 });var _createClass = function () {
      function defineProperties(target, props) {
        for (var i = 0; i < props.length; i++) {
          var descriptor = props[i];descriptor.enumerable = descriptor.enumerable || !1, descriptor.configurable = !0, "value" in descriptor && (descriptor.writable = !0), Object.defineProperty(target, descriptor.key, descriptor);
        }
      }return function (Constructor, protoProps, staticProps) {
        return protoProps && defineProperties(Constructor.prototype, protoProps), staticProps && defineProperties(Constructor, staticProps), Constructor;
      };
    }(),
        _scheduling = __webpack_require__(4),
        _scheduling2 = _interopRequireDefault(_scheduling),
        _GLTool = __webpack_require__(0),
        _GLTool2 = _interopRequireDefault(_GLTool),
        _CameraPerspective = __webpack_require__(13),
        _CameraPerspective2 = _interopRequireDefault(_CameraPerspective),
        _CameraOrtho = __webpack_require__(28),
        _CameraOrtho2 = _interopRequireDefault(_CameraOrtho),
        _OrbitalControl = __webpack_require__(27),
        _OrbitalControl2 = _interopRequireDefault(_OrbitalControl),
        Scene = function () {
      function Scene() {
        var _this = this;_classCallCheck(this, Scene), this._children = [], this._matrixIdentity = mat4.create(), _GLTool2.default.enableAlphaBlending(), this._init(), this._initTextures(), this._initViews(), this._efIndex = _scheduling2.default.addEF(function () {
          return _this._loop();
        }), window.addEventListener("resize", function () {
          return _this.resize();
        });
      }return _createClass(Scene, [{ key: "update", value: function value() {} }, { key: "render", value: function value() {} }, { key: "stop", value: function value() {
          -1 !== this._efIndex && (this._efIndex = _scheduling2.default.removeEF(this._efIndex));
        } }, { key: "start", value: function value() {
          var _this2 = this;-1 === this._efIndex && (this._efIndex = _scheduling2.default.addEF(function () {
            return _this2._loop();
          }));
        } }, { key: "resize", value: function value() {
          _GLTool2.default.setSize(window.innerWidth, window.innerHeight), this.camera.setAspectRatio(_GLTool2.default.aspectRatio);
        } }, { key: "addChild", value: function value(mChild) {
          this._children.push(mChild);
        } }, { key: "removeChild", value: function value(mChild) {
          var index = this._children.indexOf(mChild);if (-1 == index) return void console.warn("Child no exist");this._children.splice(index, 1);
        } }, { key: "_initTextures", value: function value() {} }, { key: "_initViews", value: function value() {} }, { key: "_renderChildren", value: function value() {
          for (var child = void 0, i = 0; i < this._children.length; i++) {
            child = this._children[i], child.toRender();
          }_GLTool2.default.rotate(this._matrixIdentity);
        } }, { key: "_init", value: function value() {
          this.camera = new _CameraPerspective2.default(), this.camera.setPerspective(45 * Math.PI / 180, _GLTool2.default.aspectRatio, .1, 100), this.orbitalControl = new _OrbitalControl2.default(this.camera, window, 15), this.orbitalControl.radius.value = 10, this.cameraOrtho = new _CameraOrtho2.default();
        } }, { key: "_loop", value: function value() {
          _GLTool2.default.viewport(0, 0, _GLTool2.default.width, _GLTool2.default.height), _GLTool2.default.setMatrices(this.camera), this.update(), this._renderChildren(), this.render();
        } }]), Scene;
    }();exports.default = Scene;
  }, function (module, exports, __webpack_require__) {
    "use strict";
    function _classCallCheck(instance, Constructor) {
      if (!(instance instanceof Constructor)) throw new TypeError("Cannot call a class as a function");
    }Object.defineProperty(exports, "__esModule", { value: !0 });var _createClass = function () {
      function defineProperties(target, props) {
        for (var i = 0; i < props.length; i++) {
          var descriptor = props[i];descriptor.enumerable = descriptor.enumerable || !1, descriptor.configurable = !0, "value" in descriptor && (descriptor.writable = !0), Object.defineProperty(target, descriptor.key, descriptor);
        }
      }return function (Constructor, protoProps, staticProps) {
        return protoProps && defineProperties(Constructor.prototype, protoProps), staticProps && defineProperties(Constructor, staticProps), Constructor;
      };
    }(),
        _GLShader = __webpack_require__(1),
        _GLShader2 = function (obj) {
      return obj && obj.__esModule ? obj : { default: obj };
    }(_GLShader),
        View = function () {
      function View(mStrVertex, mStrFrag) {
        _classCallCheck(this, View), this.shader = new _GLShader2.default(mStrVertex, mStrFrag), this._init();
      }return _createClass(View, [{ key: "_init", value: function value() {} }, { key: "render", value: function value() {} }]), View;
    }();exports.default = View;
  }, function (module, exports, __webpack_require__) {
    "use strict";
    function _interopRequireDefault(obj) {
      return obj && obj.__esModule ? obj : { default: obj };
    }function _classCallCheck(instance, Constructor) {
      if (!(instance instanceof Constructor)) throw new TypeError("Cannot call a class as a function");
    }function _possibleConstructorReturn(self, call) {
      if (!self) throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return !call || "object" != (typeof call === "undefined" ? "undefined" : _typeof2(call)) && "function" != typeof call ? self : call;
    }function _inherits(subClass, superClass) {
      if ("function" != typeof superClass && null !== superClass) throw new TypeError("Super expression must either be null or a function, not " + (typeof superClass === "undefined" ? "undefined" : _typeof2(superClass)));subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: !1, writable: !0, configurable: !0 } }), superClass && (Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass);
    }Object.defineProperty(exports, "__esModule", { value: !0 });var _createClass = function () {
      function defineProperties(target, props) {
        for (var i = 0; i < props.length; i++) {
          var descriptor = props[i];descriptor.enumerable = descriptor.enumerable || !1, descriptor.configurable = !0, "value" in descriptor && (descriptor.writable = !0), Object.defineProperty(target, descriptor.key, descriptor);
        }
      }return function (Constructor, protoProps, staticProps) {
        return protoProps && defineProperties(Constructor.prototype, protoProps), staticProps && defineProperties(Constructor, staticProps), Constructor;
      };
    }(),
        _Object3D2 = __webpack_require__(29),
        _Object3D3 = _interopRequireDefault(_Object3D2),
        _GLShader = __webpack_require__(1),
        _GLShader2 = _interopRequireDefault(_GLShader),
        _GLTool = __webpack_require__(0),
        View3D = (_interopRequireDefault(_GLTool), function (_Object3D) {
      function View3D(mStrVertex, mStrFrag) {
        _classCallCheck(this, View3D);var _this = _possibleConstructorReturn(this, (View3D.__proto__ || Object.getPrototypeOf(View3D)).call(this));return _this._children = [], _this.shader = new _GLShader2.default(mStrVertex, mStrFrag), _this._init(), _this;
      }return _inherits(View3D, _Object3D), _createClass(View3D, [{ key: "_init", value: function value() {} }, { key: "render", value: function value() {} }]), View3D;
    }(_Object3D3.default));exports.default = View3D;
  }, function (module, exports, __webpack_require__) {
    "use strict";
    function _interopRequireDefault(obj) {
      return obj && obj.__esModule ? obj : { default: obj };
    }function _classCallCheck(instance, Constructor) {
      if (!(instance instanceof Constructor)) throw new TypeError("Cannot call a class as a function");
    }Object.defineProperty(exports, "__esModule", { value: !0 });var _createClass = function () {
      function defineProperties(target, props) {
        for (var i = 0; i < props.length; i++) {
          var descriptor = props[i];descriptor.enumerable = descriptor.enumerable || !1, descriptor.configurable = !0, "value" in descriptor && (descriptor.writable = !0), Object.defineProperty(target, descriptor.key, descriptor);
        }
      }return function (Constructor, protoProps, staticProps) {
        return protoProps && defineProperties(Constructor.prototype, protoProps), staticProps && defineProperties(Constructor, staticProps), Constructor;
      };
    }(),
        _GLTool = __webpack_require__(0),
        _GLTool2 = _interopRequireDefault(_GLTool),
        _Mesh = __webpack_require__(5),
        _Mesh2 = _interopRequireDefault(_Mesh),
        _GLShader = __webpack_require__(1),
        _GLShader2 = _interopRequireDefault(_GLShader),
        Draw = function () {
      function Draw() {
        return _classCallCheck(this, Draw), this._uniforms = {}, this._uniformTextures = [], this._fbo, this._clearColor = { r: 0, g: 0, b: 0, a: 0 }, this;
      }return _createClass(Draw, [{ key: "setClearColor", value: function value() {
          var r = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : 0,
              g = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : 0,
              b = arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : 0,
              a = arguments.length > 3 && void 0 !== arguments[3] ? arguments[3] : 0;return this._clearColor.r = r, this._clearColor.g = g, this._clearColor.b = b, this._clearColor.a = a, this;
        } }, { key: "useProgram", value: function value(vs, fs) {
          return vs instanceof _GLShader2.default ? this._shader = vs : this._shader = new _GLShader2.default(vs, fs), this;
        } }, { key: "setMesh", value: function value(mMesh) {
          return this._mesh = mMesh, this;
        } }, { key: "createMesh", value: function value(mType) {
          return this._mesh = new _Mesh2.default(mType), this;
        } }, { key: "bufferVertex", value: function value(mArrayVertices) {
          return this._mesh || (this._mesh = new _Mesh2.default()), this._mesh.bufferVertex(mArrayVertices), this;
        } }, { key: "bufferTexCoord", value: function value(mArrayTexCoords) {
          return this._mesh || (this._mesh = new _Mesh2.default()), this._mesh.bufferTexCoord(mArrayTexCoords), this;
        } }, { key: "bufferNormal", value: function value(mArrayNormals) {
          return this._mesh || (this._mesh = new _Mesh2.default()), this._mesh.bufferNormal(mArrayNormals), this;
        } }, { key: "bufferIndex", value: function value(mIndices) {
          return this._mesh || (this._mesh = new _Mesh2.default()), this._mesh.bufferIndex(mIndices), this;
        } }, { key: "bufferInstance", value: function value(mData, mName) {
          return this._mesh ? (this._mesh.bufferInstance(mData, mName), this) : (console.warn("Need to create mesh first"), this);
        } }, { key: "bufferData", value: function value(mArrayData, mName) {
          return this._mesh || (this._mesh = new _Mesh2.default()), this._mesh.bufferData(mArrayData, mName), this;
        } }, { key: "uniform", value: function value(name, type, _value) {
          return this._uniforms[name] = { type: type, value: _value }, this;
        } }, { key: "uniformTexture", value: function value(name, texture, index) {
          return void 0 !== index ? this._uniformTextures[index] = { name: name, texture: texture } : this._uniformTextures.push({ name: name, texture: texture }), this;
        } }, { key: "bindFrameBuffer", value: function value(fbo) {
          return this._fbo = fbo, this;
        } }, { key: "draw", value: function value() {
          var _this = this;if (this._shader && this._mesh) {
            if (this._fbo) {
              var _clearColor = this._clearColor,
                  r = _clearColor.r,
                  g = _clearColor.g,
                  b = _clearColor.b,
                  a = _clearColor.a;this._fbo.bind(), _GLTool2.default.clear(r, g, b, a);
            }this._shader.bind();for (var s in this._uniforms) {
              var o = this._uniforms[s];this._shader.uniform(s, o.type, o.value);
            }return this._uniformTextures.forEach(function (o, i) {
              void 0 !== o && (_this._shader.uniform(o.name, "uniform1i", i), o.texture.bind(i));
            }), _GLTool2.default.draw(this._mesh), this._fbo && this._fbo.unbind(), this;
          }
        } }, { key: "shader", get: function get() {
          return this._shader;
        } }, { key: "framebuffer", get: function get() {
          return this._fbo;
        } }]), Draw;
    }();exports.default = Draw;
  }, function (module, exports, __webpack_require__) {
    "use strict";
    function _interopRequireDefault(obj) {
      return obj && obj.__esModule ? obj : { default: obj };
    }Object.defineProperty(exports, "__esModule", { value: !0 });var _simpleColor = __webpack_require__(16),
        _simpleColor2 = _interopRequireDefault(_simpleColor),
        _bigTriangle = __webpack_require__(30),
        _bigTriangle2 = _interopRequireDefault(_bigTriangle),
        _general = __webpack_require__(31),
        _general2 = _interopRequireDefault(_general),
        _copy = __webpack_require__(15),
        _copy2 = _interopRequireDefault(_copy),
        _basic = __webpack_require__(9),
        _basic2 = _interopRequireDefault(_basic),
        _skybox = __webpack_require__(32),
        _skybox2 = _interopRequireDefault(_skybox),
        _skybox3 = __webpack_require__(33),
        _skybox4 = _interopRequireDefault(_skybox3),
        ShaderLibs = { simpleColorFrag: _simpleColor2.default, bigTriangleVert: _bigTriangle2.default, generalVert: _general2.default, copyFrag: _copy2.default, basicVert: _basic2.default, skyboxVert: _skybox2.default, skyboxFrag: _skybox4.default };exports.default = ShaderLibs;
  }, function (module, exports, __webpack_require__) {
    "use strict";
    function _classCallCheck(instance, Constructor) {
      if (!(instance instanceof Constructor)) throw new TypeError("Cannot call a class as a function");
    }function _possibleConstructorReturn(self, call) {
      if (!self) throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return !call || "object" != (typeof call === "undefined" ? "undefined" : _typeof2(call)) && "function" != typeof call ? self : call;
    }function _inherits(subClass, superClass) {
      if ("function" != typeof superClass && null !== superClass) throw new TypeError("Super expression must either be null or a function, not " + (typeof superClass === "undefined" ? "undefined" : _typeof2(superClass)));subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: !1, writable: !0, configurable: !0 } }), superClass && (Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass);
    }Object.defineProperty(exports, "__esModule", { value: !0 });var _FboArray = __webpack_require__(34),
        _FboArray2 = function (obj) {
      return obj && obj.__esModule ? obj : { default: obj };
    }(_FboArray),
        FboPingPong = function (_FboFarray) {
      function FboPingPong(width, height) {
        var params = arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : {},
            mNumTargets = arguments.length > 3 && void 0 !== arguments[3] ? arguments[3] : 1;return _classCallCheck(this, FboPingPong), _possibleConstructorReturn(this, (FboPingPong.__proto__ || Object.getPrototypeOf(FboPingPong)).call(this, 2, width, height, params, mNumTargets));
      }return _inherits(FboPingPong, _FboFarray), FboPingPong;
    }(_FboArray2.default);exports.default = FboPingPong;
  }]);
});
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(1)(module)))

/***/ }),

/***/ 1:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


module.exports = function (module) {
	if (!module.webpackPolyfill) {
		module.deprecate = function () {};
		module.paths = [];
		// module.parent = undefined by default
		if (!module.children) module.children = [];
		Object.defineProperty(module, "loaded", {
			enumerable: true,
			get: function get() {
				return module.l;
			}
		});
		Object.defineProperty(module, "id", {
			enumerable: true,
			get: function get() {
				return module.i;
			}
		});
		module.webpackPolyfill = 1;
	}
	return module;
};

/***/ }),

/***/ 36:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _datGui = __webpack_require__(37);

var _datGui2 = _interopRequireDefault(_datGui);

var _stats = __webpack_require__(40);

var _stats2 = _interopRequireDefault(_stats);

var _alfrid = __webpack_require__(0);

var _alfrid2 = _interopRequireDefault(_alfrid);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// INIT DAT-GUI
window.gui = new _datGui2.default.GUI({ width: 300 }); // debug.js

var div = document.body.querySelector('.dg.ac');
div.style.zIndex = '999';

// STATS
var stats = new _stats2.default();
document.body.appendChild(stats.domElement);
_alfrid2.default.Scheduler.addEF(function () {
  return stats.update();
});

/***/ }),

/***/ 37:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


module.exports = __webpack_require__(38);
module.exports.color = __webpack_require__(39);

/***/ }),

/***/ 38:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

/**
 * dat-gui JavaScript Controller Library
 * http://code.google.com/p/dat-gui
 *
 * Copyright 2011 Data Arts Team, Google Creative Lab
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 */

/** @namespace */
var dat = module.exports = dat || {};

/** @namespace */
dat.gui = dat.gui || {};

/** @namespace */
dat.utils = dat.utils || {};

/** @namespace */
dat.controllers = dat.controllers || {};

/** @namespace */
dat.dom = dat.dom || {};

/** @namespace */
dat.color = dat.color || {};

dat.utils.css = function () {
  return {
    load: function load(url, doc) {
      doc = doc || document;
      var link = doc.createElement('link');
      link.type = 'text/css';
      link.rel = 'stylesheet';
      link.href = url;
      doc.getElementsByTagName('head')[0].appendChild(link);
    },
    inject: function inject(css, doc) {
      doc = doc || document;
      var injected = document.createElement('style');
      injected.type = 'text/css';
      injected.innerHTML = css;
      doc.getElementsByTagName('head')[0].appendChild(injected);
    }
  };
}();

dat.utils.common = function () {

  var ARR_EACH = Array.prototype.forEach;
  var ARR_SLICE = Array.prototype.slice;

  /**
   * Band-aid methods for things that should be a lot easier in JavaScript.
   * Implementation and structure inspired by underscore.js
   * http://documentcloud.github.com/underscore/
   */

  return {

    BREAK: {},

    extend: function extend(target) {

      this.each(ARR_SLICE.call(arguments, 1), function (obj) {

        for (var key in obj) {
          if (!this.isUndefined(obj[key])) target[key] = obj[key];
        }
      }, this);

      return target;
    },

    defaults: function defaults(target) {

      this.each(ARR_SLICE.call(arguments, 1), function (obj) {

        for (var key in obj) {
          if (this.isUndefined(target[key])) target[key] = obj[key];
        }
      }, this);

      return target;
    },

    compose: function compose() {
      var toCall = ARR_SLICE.call(arguments);
      return function () {
        var args = ARR_SLICE.call(arguments);
        for (var i = toCall.length - 1; i >= 0; i--) {
          args = [toCall[i].apply(this, args)];
        }
        return args[0];
      };
    },

    each: function each(obj, itr, scope) {

      if (ARR_EACH && obj.forEach === ARR_EACH) {

        obj.forEach(itr, scope);
      } else if (obj.length === obj.length + 0) {
        // Is number but not NaN

        for (var key = 0, l = obj.length; key < l; key++) {
          if (key in obj && itr.call(scope, obj[key], key) === this.BREAK) return;
        }
      } else {

        for (var key in obj) {
          if (itr.call(scope, obj[key], key) === this.BREAK) return;
        }
      }
    },

    defer: function defer(fnc) {
      setTimeout(fnc, 0);
    },

    toArray: function toArray(obj) {
      if (obj.toArray) return obj.toArray();
      return ARR_SLICE.call(obj);
    },

    isUndefined: function isUndefined(obj) {
      return obj === undefined;
    },

    isNull: function isNull(obj) {
      return obj === null;
    },

    isNaN: function isNaN(obj) {
      return obj !== obj;
    },

    isArray: Array.isArray || function (obj) {
      return obj.constructor === Array;
    },

    isObject: function isObject(obj) {
      return obj === Object(obj);
    },

    isNumber: function isNumber(obj) {
      return obj === obj + 0;
    },

    isString: function isString(obj) {
      return obj === obj + '';
    },

    isBoolean: function isBoolean(obj) {
      return obj === false || obj === true;
    },

    isFunction: function isFunction(obj) {
      return Object.prototype.toString.call(obj) === '[object Function]';
    }

  };
}();

dat.controllers.Controller = function (common) {

  /**
   * @class An "abstract" class that represents a given property of an object.
   *
   * @param {Object} object The object to be manipulated
   * @param {string} property The name of the property to be manipulated
   *
   * @member dat.controllers
   */
  var Controller = function Controller(object, property) {

    this.initialValue = object[property];

    /**
     * Those who extend this class will put their DOM elements in here.
     * @type {DOMElement}
     */
    this.domElement = document.createElement('div');

    /**
     * The object to manipulate
     * @type {Object}
     */
    this.object = object;

    /**
     * The name of the property to manipulate
     * @type {String}
     */
    this.property = property;

    /**
     * The function to be called on change.
     * @type {Function}
     * @ignore
     */
    this.__onChange = undefined;

    /**
     * The function to be called on finishing change.
     * @type {Function}
     * @ignore
     */
    this.__onFinishChange = undefined;
  };

  common.extend(Controller.prototype,

  /** @lends dat.controllers.Controller.prototype */
  {

    /**
     * Specify that a function fire every time someone changes the value with
     * this Controller.
     *
     * @param {Function} fnc This function will be called whenever the value
     * is modified via this Controller.
     * @returns {dat.controllers.Controller} this
     */
    onChange: function onChange(fnc) {
      this.__onChange = fnc;
      return this;
    },

    /**
     * Specify that a function fire every time someone "finishes" changing
     * the value wih this Controller. Useful for values that change
     * incrementally like numbers or strings.
     *
     * @param {Function} fnc This function will be called whenever
     * someone "finishes" changing the value via this Controller.
     * @returns {dat.controllers.Controller} this
     */
    onFinishChange: function onFinishChange(fnc) {
      this.__onFinishChange = fnc;
      return this;
    },

    /**
     * Change the value of <code>object[property]</code>
     *
     * @param {Object} newValue The new value of <code>object[property]</code>
     */
    setValue: function setValue(newValue) {
      this.object[this.property] = newValue;
      if (this.__onChange) {
        this.__onChange.call(this, newValue);
      }
      this.updateDisplay();
      return this;
    },

    /**
     * Gets the value of <code>object[property]</code>
     *
     * @returns {Object} The current value of <code>object[property]</code>
     */
    getValue: function getValue() {
      return this.object[this.property];
    },

    /**
     * Refreshes the visual display of a Controller in order to keep sync
     * with the object's current value.
     * @returns {dat.controllers.Controller} this
     */
    updateDisplay: function updateDisplay() {
      return this;
    },

    /**
     * @returns {Boolean} true if the value has deviated from initialValue
     */
    isModified: function isModified() {
      return this.initialValue !== this.getValue();
    }

  });

  return Controller;
}(dat.utils.common);

dat.dom.dom = function (common) {

  var EVENT_MAP = {
    'HTMLEvents': ['change'],
    'MouseEvents': ['click', 'mousemove', 'mousedown', 'mouseup', 'mouseover'],
    'KeyboardEvents': ['keydown']
  };

  var EVENT_MAP_INV = {};
  common.each(EVENT_MAP, function (v, k) {
    common.each(v, function (e) {
      EVENT_MAP_INV[e] = k;
    });
  });

  var CSS_VALUE_PIXELS = /(\d+(\.\d+)?)px/;

  function cssValueToPixels(val) {

    if (val === '0' || common.isUndefined(val)) return 0;

    var match = val.match(CSS_VALUE_PIXELS);

    if (!common.isNull(match)) {
      return parseFloat(match[1]);
    }

    // TODO ...ems? %?

    return 0;
  }

  /**
   * @namespace
   * @member dat.dom
   */
  var dom = {

    /**
     * 
     * @param elem
     * @param selectable
     */
    makeSelectable: function makeSelectable(elem, selectable) {

      if (elem === undefined || elem.style === undefined) return;

      elem.onselectstart = selectable ? function () {
        return false;
      } : function () {};

      elem.style.MozUserSelect = selectable ? 'auto' : 'none';
      elem.style.KhtmlUserSelect = selectable ? 'auto' : 'none';
      elem.unselectable = selectable ? 'on' : 'off';
    },

    /**
     *
     * @param elem
     * @param horizontal
     * @param vertical
     */
    makeFullscreen: function makeFullscreen(elem, horizontal, vertical) {

      if (common.isUndefined(horizontal)) horizontal = true;
      if (common.isUndefined(vertical)) vertical = true;

      elem.style.position = 'absolute';

      if (horizontal) {
        elem.style.left = 0;
        elem.style.right = 0;
      }
      if (vertical) {
        elem.style.top = 0;
        elem.style.bottom = 0;
      }
    },

    /**
     *
     * @param elem
     * @param eventType
     * @param params
     */
    fakeEvent: function fakeEvent(elem, eventType, params, aux) {
      params = params || {};
      var className = EVENT_MAP_INV[eventType];
      if (!className) {
        throw new Error('Event type ' + eventType + ' not supported.');
      }
      var evt = document.createEvent(className);
      switch (className) {
        case 'MouseEvents':
          var clientX = params.x || params.clientX || 0;
          var clientY = params.y || params.clientY || 0;
          evt.initMouseEvent(eventType, params.bubbles || false, params.cancelable || true, window, params.clickCount || 1, 0, //screen X
          0, //screen Y
          clientX, //client X
          clientY, //client Y
          false, false, false, false, 0, null);
          break;
        case 'KeyboardEvents':
          var init = evt.initKeyboardEvent || evt.initKeyEvent; // webkit || moz
          common.defaults(params, {
            cancelable: true,
            ctrlKey: false,
            altKey: false,
            shiftKey: false,
            metaKey: false,
            keyCode: undefined,
            charCode: undefined
          });
          init(eventType, params.bubbles || false, params.cancelable, window, params.ctrlKey, params.altKey, params.shiftKey, params.metaKey, params.keyCode, params.charCode);
          break;
        default:
          evt.initEvent(eventType, params.bubbles || false, params.cancelable || true);
          break;
      }
      common.defaults(evt, aux);
      elem.dispatchEvent(evt);
    },

    /**
     *
     * @param elem
     * @param event
     * @param func
     * @param bool
     */
    bind: function bind(elem, event, func, bool) {
      bool = bool || false;
      if (elem.addEventListener) elem.addEventListener(event, func, bool);else if (elem.attachEvent) elem.attachEvent('on' + event, func);
      return dom;
    },

    /**
     *
     * @param elem
     * @param event
     * @param func
     * @param bool
     */
    unbind: function unbind(elem, event, func, bool) {
      bool = bool || false;
      if (elem.removeEventListener) elem.removeEventListener(event, func, bool);else if (elem.detachEvent) elem.detachEvent('on' + event, func);
      return dom;
    },

    /**
     *
     * @param elem
     * @param className
     */
    addClass: function addClass(elem, className) {
      if (elem.className === undefined) {
        elem.className = className;
      } else if (elem.className !== className) {
        var classes = elem.className.split(/ +/);
        if (classes.indexOf(className) == -1) {
          classes.push(className);
          elem.className = classes.join(' ').replace(/^\s+/, '').replace(/\s+$/, '');
        }
      }
      return dom;
    },

    /**
     *
     * @param elem
     * @param className
     */
    removeClass: function removeClass(elem, className) {
      if (className) {
        if (elem.className === undefined) {
          // elem.className = className;
        } else if (elem.className === className) {
          elem.removeAttribute('class');
        } else {
          var classes = elem.className.split(/ +/);
          var index = classes.indexOf(className);
          if (index != -1) {
            classes.splice(index, 1);
            elem.className = classes.join(' ');
          }
        }
      } else {
        elem.className = undefined;
      }
      return dom;
    },

    hasClass: function hasClass(elem, className) {
      return new RegExp('(?:^|\\s+)' + className + '(?:\\s+|$)').test(elem.className) || false;
    },

    /**
     *
     * @param elem
     */
    getWidth: function getWidth(elem) {

      var style = getComputedStyle(elem);

      return cssValueToPixels(style['border-left-width']) + cssValueToPixels(style['border-right-width']) + cssValueToPixels(style['padding-left']) + cssValueToPixels(style['padding-right']) + cssValueToPixels(style['width']);
    },

    /**
     *
     * @param elem
     */
    getHeight: function getHeight(elem) {

      var style = getComputedStyle(elem);

      return cssValueToPixels(style['border-top-width']) + cssValueToPixels(style['border-bottom-width']) + cssValueToPixels(style['padding-top']) + cssValueToPixels(style['padding-bottom']) + cssValueToPixels(style['height']);
    },

    /**
     *
     * @param elem
     */
    getOffset: function getOffset(elem) {
      var offset = { left: 0, top: 0 };
      if (elem.offsetParent) {
        do {
          offset.left += elem.offsetLeft;
          offset.top += elem.offsetTop;
        } while (elem = elem.offsetParent);
      }
      return offset;
    },

    // http://stackoverflow.com/posts/2684561/revisions
    /**
     * 
     * @param elem
     */
    isActive: function isActive(elem) {
      return elem === document.activeElement && (elem.type || elem.href);
    }

  };

  return dom;
}(dat.utils.common);

dat.controllers.OptionController = function (Controller, dom, common) {

  /**
   * @class Provides a select input to alter the property of an object, using a
   * list of accepted values.
   *
   * @extends dat.controllers.Controller
   *
   * @param {Object} object The object to be manipulated
   * @param {string} property The name of the property to be manipulated
   * @param {Object|string[]} options A map of labels to acceptable values, or
   * a list of acceptable string values.
   *
   * @member dat.controllers
   */
  var OptionController = function OptionController(object, property, options) {

    OptionController.superclass.call(this, object, property);

    var _this = this;

    /**
     * The drop down menu
     * @ignore
     */
    this.__select = document.createElement('select');

    if (common.isArray(options)) {
      var map = {};
      common.each(options, function (element) {
        map[element] = element;
      });
      options = map;
    }

    common.each(options, function (value, key) {

      var opt = document.createElement('option');
      opt.innerHTML = key;
      opt.setAttribute('value', value);
      _this.__select.appendChild(opt);
    });

    // Acknowledge original value
    this.updateDisplay();

    dom.bind(this.__select, 'change', function () {
      var desiredValue = this.options[this.selectedIndex].value;
      _this.setValue(desiredValue);
    });

    this.domElement.appendChild(this.__select);
  };

  OptionController.superclass = Controller;

  common.extend(OptionController.prototype, Controller.prototype, {

    setValue: function setValue(v) {
      var toReturn = OptionController.superclass.prototype.setValue.call(this, v);
      if (this.__onFinishChange) {
        this.__onFinishChange.call(this, this.getValue());
      }
      return toReturn;
    },

    updateDisplay: function updateDisplay() {
      this.__select.value = this.getValue();
      return OptionController.superclass.prototype.updateDisplay.call(this);
    }

  });

  return OptionController;
}(dat.controllers.Controller, dat.dom.dom, dat.utils.common);

dat.controllers.NumberController = function (Controller, common) {

  /**
   * @class Represents a given property of an object that is a number.
   *
   * @extends dat.controllers.Controller
   *
   * @param {Object} object The object to be manipulated
   * @param {string} property The name of the property to be manipulated
   * @param {Object} [params] Optional parameters
   * @param {Number} [params.min] Minimum allowed value
   * @param {Number} [params.max] Maximum allowed value
   * @param {Number} [params.step] Increment by which to change value
   *
   * @member dat.controllers
   */
  var NumberController = function NumberController(object, property, params) {

    NumberController.superclass.call(this, object, property);

    params = params || {};

    this.__min = params.min;
    this.__max = params.max;
    this.__step = params.step;

    if (common.isUndefined(this.__step)) {

      if (this.initialValue == 0) {
        this.__impliedStep = 1; // What are we, psychics?
      } else {
        // Hey Doug, check this out.
        this.__impliedStep = Math.pow(10, Math.floor(Math.log(this.initialValue) / Math.LN10)) / 10;
      }
    } else {

      this.__impliedStep = this.__step;
    }

    this.__precision = numDecimals(this.__impliedStep);
  };

  NumberController.superclass = Controller;

  common.extend(NumberController.prototype, Controller.prototype,

  /** @lends dat.controllers.NumberController.prototype */
  {

    setValue: function setValue(v) {

      if (this.__min !== undefined && v < this.__min) {
        v = this.__min;
      } else if (this.__max !== undefined && v > this.__max) {
        v = this.__max;
      }

      if (this.__step !== undefined && v % this.__step != 0) {
        v = Math.round(v / this.__step) * this.__step;
      }

      return NumberController.superclass.prototype.setValue.call(this, v);
    },

    /**
     * Specify a minimum value for <code>object[property]</code>.
     *
     * @param {Number} minValue The minimum value for
     * <code>object[property]</code>
     * @returns {dat.controllers.NumberController} this
     */
    min: function min(v) {
      this.__min = v;
      return this;
    },

    /**
     * Specify a maximum value for <code>object[property]</code>.
     *
     * @param {Number} maxValue The maximum value for
     * <code>object[property]</code>
     * @returns {dat.controllers.NumberController} this
     */
    max: function max(v) {
      this.__max = v;
      return this;
    },

    /**
     * Specify a step value that dat.controllers.NumberController
     * increments by.
     *
     * @param {Number} stepValue The step value for
     * dat.controllers.NumberController
     * @default if minimum and maximum specified increment is 1% of the
     * difference otherwise stepValue is 1
     * @returns {dat.controllers.NumberController} this
     */
    step: function step(v) {
      this.__step = v;
      return this;
    }

  });

  function numDecimals(x) {
    x = x.toString();
    if (x.indexOf('.') > -1) {
      return x.length - x.indexOf('.') - 1;
    } else {
      return 0;
    }
  }

  return NumberController;
}(dat.controllers.Controller, dat.utils.common);

dat.controllers.NumberControllerBox = function (NumberController, dom, common) {

  /**
   * @class Represents a given property of an object that is a number and
   * provides an input element with which to manipulate it.
   *
   * @extends dat.controllers.Controller
   * @extends dat.controllers.NumberController
   *
   * @param {Object} object The object to be manipulated
   * @param {string} property The name of the property to be manipulated
   * @param {Object} [params] Optional parameters
   * @param {Number} [params.min] Minimum allowed value
   * @param {Number} [params.max] Maximum allowed value
   * @param {Number} [params.step] Increment by which to change value
   *
   * @member dat.controllers
   */
  var NumberControllerBox = function NumberControllerBox(object, property, params) {

    this.__truncationSuspended = false;

    NumberControllerBox.superclass.call(this, object, property, params);

    var _this = this;

    /**
     * {Number} Previous mouse y position
     * @ignore
     */
    var prev_y;

    this.__input = document.createElement('input');
    this.__input.setAttribute('type', 'text');

    // Makes it so manually specified values are not truncated.

    dom.bind(this.__input, 'change', onChange);
    dom.bind(this.__input, 'blur', onBlur);
    dom.bind(this.__input, 'mousedown', onMouseDown);
    dom.bind(this.__input, 'keydown', function (e) {

      // When pressing entire, you can be as precise as you want.
      if (e.keyCode === 13) {
        _this.__truncationSuspended = true;
        this.blur();
        _this.__truncationSuspended = false;
      }
    });

    function onChange() {
      var attempted = parseFloat(_this.__input.value);
      if (!common.isNaN(attempted)) _this.setValue(attempted);
    }

    function onBlur() {
      onChange();
      if (_this.__onFinishChange) {
        _this.__onFinishChange.call(_this, _this.getValue());
      }
    }

    function onMouseDown(e) {
      dom.bind(window, 'mousemove', onMouseDrag);
      dom.bind(window, 'mouseup', onMouseUp);
      prev_y = e.clientY;
    }

    function onMouseDrag(e) {

      var diff = prev_y - e.clientY;
      _this.setValue(_this.getValue() + diff * _this.__impliedStep);

      prev_y = e.clientY;
    }

    function onMouseUp() {
      dom.unbind(window, 'mousemove', onMouseDrag);
      dom.unbind(window, 'mouseup', onMouseUp);
    }

    this.updateDisplay();

    this.domElement.appendChild(this.__input);
  };

  NumberControllerBox.superclass = NumberController;

  common.extend(NumberControllerBox.prototype, NumberController.prototype, {

    updateDisplay: function updateDisplay() {

      this.__input.value = this.__truncationSuspended ? this.getValue() : roundToDecimal(this.getValue(), this.__precision);
      return NumberControllerBox.superclass.prototype.updateDisplay.call(this);
    }

  });

  function roundToDecimal(value, decimals) {
    var tenTo = Math.pow(10, decimals);
    return Math.round(value * tenTo) / tenTo;
  }

  return NumberControllerBox;
}(dat.controllers.NumberController, dat.dom.dom, dat.utils.common);

dat.controllers.NumberControllerSlider = function (NumberController, dom, css, common, styleSheet) {

  /**
   * @class Represents a given property of an object that is a number, contains
   * a minimum and maximum, and provides a slider element with which to
   * manipulate it. It should be noted that the slider element is made up of
   * <code>&lt;div&gt;</code> tags, <strong>not</strong> the html5
   * <code>&lt;slider&gt;</code> element.
   *
   * @extends dat.controllers.Controller
   * @extends dat.controllers.NumberController
   * 
   * @param {Object} object The object to be manipulated
   * @param {string} property The name of the property to be manipulated
   * @param {Number} minValue Minimum allowed value
   * @param {Number} maxValue Maximum allowed value
   * @param {Number} stepValue Increment by which to change value
   *
   * @member dat.controllers
   */
  var NumberControllerSlider = function NumberControllerSlider(object, property, min, max, step) {

    NumberControllerSlider.superclass.call(this, object, property, { min: min, max: max, step: step });

    var _this = this;

    this.__background = document.createElement('div');
    this.__foreground = document.createElement('div');

    dom.bind(this.__background, 'mousedown', onMouseDown);

    dom.addClass(this.__background, 'slider');
    dom.addClass(this.__foreground, 'slider-fg');

    function onMouseDown(e) {

      dom.bind(window, 'mousemove', onMouseDrag);
      dom.bind(window, 'mouseup', onMouseUp);

      onMouseDrag(e);
    }

    function onMouseDrag(e) {

      e.preventDefault();

      var offset = dom.getOffset(_this.__background);
      var width = dom.getWidth(_this.__background);

      _this.setValue(map(e.clientX, offset.left, offset.left + width, _this.__min, _this.__max));

      return false;
    }

    function onMouseUp() {
      dom.unbind(window, 'mousemove', onMouseDrag);
      dom.unbind(window, 'mouseup', onMouseUp);
      if (_this.__onFinishChange) {
        _this.__onFinishChange.call(_this, _this.getValue());
      }
    }

    this.updateDisplay();

    this.__background.appendChild(this.__foreground);
    this.domElement.appendChild(this.__background);
  };

  NumberControllerSlider.superclass = NumberController;

  /**
   * Injects default stylesheet for slider elements.
   */
  NumberControllerSlider.useDefaultStyles = function () {
    css.inject(styleSheet);
  };

  common.extend(NumberControllerSlider.prototype, NumberController.prototype, {

    updateDisplay: function updateDisplay() {
      var pct = (this.getValue() - this.__min) / (this.__max - this.__min);
      this.__foreground.style.width = pct * 100 + '%';
      return NumberControllerSlider.superclass.prototype.updateDisplay.call(this);
    }

  });

  function map(v, i1, i2, o1, o2) {
    return o1 + (o2 - o1) * ((v - i1) / (i2 - i1));
  }

  return NumberControllerSlider;
}(dat.controllers.NumberController, dat.dom.dom, dat.utils.css, dat.utils.common, ".slider {\n  box-shadow: inset 0 2px 4px rgba(0,0,0,0.15);\n  height: 1em;\n  border-radius: 1em;\n  background-color: #eee;\n  padding: 0 0.5em;\n  overflow: hidden;\n}\n\n.slider-fg {\n  padding: 1px 0 2px 0;\n  background-color: #aaa;\n  height: 1em;\n  margin-left: -0.5em;\n  padding-right: 0.5em;\n  border-radius: 1em 0 0 1em;\n}\n\n.slider-fg:after {\n  display: inline-block;\n  border-radius: 1em;\n  background-color: #fff;\n  border:  1px solid #aaa;\n  content: '';\n  float: right;\n  margin-right: -1em;\n  margin-top: -1px;\n  height: 0.9em;\n  width: 0.9em;\n}");

dat.controllers.FunctionController = function (Controller, dom, common) {

  /**
   * @class Provides a GUI interface to fire a specified method, a property of an object.
   *
   * @extends dat.controllers.Controller
   *
   * @param {Object} object The object to be manipulated
   * @param {string} property The name of the property to be manipulated
   *
   * @member dat.controllers
   */
  var FunctionController = function FunctionController(object, property, text) {

    FunctionController.superclass.call(this, object, property);

    var _this = this;

    this.__button = document.createElement('div');
    this.__button.innerHTML = text === undefined ? 'Fire' : text;
    dom.bind(this.__button, 'click', function (e) {
      e.preventDefault();
      _this.fire();
      return false;
    });

    dom.addClass(this.__button, 'button');

    this.domElement.appendChild(this.__button);
  };

  FunctionController.superclass = Controller;

  common.extend(FunctionController.prototype, Controller.prototype, {

    fire: function fire() {
      if (this.__onChange) {
        this.__onChange.call(this);
      }
      if (this.__onFinishChange) {
        this.__onFinishChange.call(this, this.getValue());
      }
      this.getValue().call(this.object);
    }
  });

  return FunctionController;
}(dat.controllers.Controller, dat.dom.dom, dat.utils.common);

dat.controllers.BooleanController = function (Controller, dom, common) {

  /**
   * @class Provides a checkbox input to alter the boolean property of an object.
   * @extends dat.controllers.Controller
   *
   * @param {Object} object The object to be manipulated
   * @param {string} property The name of the property to be manipulated
   *
   * @member dat.controllers
   */
  var BooleanController = function BooleanController(object, property) {

    BooleanController.superclass.call(this, object, property);

    var _this = this;
    this.__prev = this.getValue();

    this.__checkbox = document.createElement('input');
    this.__checkbox.setAttribute('type', 'checkbox');

    dom.bind(this.__checkbox, 'change', onChange, false);

    this.domElement.appendChild(this.__checkbox);

    // Match original value
    this.updateDisplay();

    function onChange() {
      _this.setValue(!_this.__prev);
    }
  };

  BooleanController.superclass = Controller;

  common.extend(BooleanController.prototype, Controller.prototype, {

    setValue: function setValue(v) {
      var toReturn = BooleanController.superclass.prototype.setValue.call(this, v);
      if (this.__onFinishChange) {
        this.__onFinishChange.call(this, this.getValue());
      }
      this.__prev = this.getValue();
      return toReturn;
    },

    updateDisplay: function updateDisplay() {

      if (this.getValue() === true) {
        this.__checkbox.setAttribute('checked', 'checked');
        this.__checkbox.checked = true;
      } else {
        this.__checkbox.checked = false;
      }

      return BooleanController.superclass.prototype.updateDisplay.call(this);
    }

  });

  return BooleanController;
}(dat.controllers.Controller, dat.dom.dom, dat.utils.common);

dat.color.toString = function (common) {

  return function (color) {

    if (color.a == 1 || common.isUndefined(color.a)) {

      var s = color.hex.toString(16);
      while (s.length < 6) {
        s = '0' + s;
      }

      return '#' + s;
    } else {

      return 'rgba(' + Math.round(color.r) + ',' + Math.round(color.g) + ',' + Math.round(color.b) + ',' + color.a + ')';
    }
  };
}(dat.utils.common);

dat.color.interpret = function (toString, common) {

  var result, toReturn;

  var interpret = function interpret() {

    toReturn = false;

    var original = arguments.length > 1 ? common.toArray(arguments) : arguments[0];

    common.each(INTERPRETATIONS, function (family) {

      if (family.litmus(original)) {

        common.each(family.conversions, function (conversion, conversionName) {

          result = conversion.read(original);

          if (toReturn === false && result !== false) {
            toReturn = result;
            result.conversionName = conversionName;
            result.conversion = conversion;
            return common.BREAK;
          }
        });

        return common.BREAK;
      }
    });

    return toReturn;
  };

  var INTERPRETATIONS = [

  // Strings
  {

    litmus: common.isString,

    conversions: {

      THREE_CHAR_HEX: {

        read: function read(original) {

          var test = original.match(/^#([A-F0-9])([A-F0-9])([A-F0-9])$/i);
          if (test === null) return false;

          return {
            space: 'HEX',
            hex: parseInt('0x' + test[1].toString() + test[1].toString() + test[2].toString() + test[2].toString() + test[3].toString() + test[3].toString())
          };
        },

        write: toString

      },

      SIX_CHAR_HEX: {

        read: function read(original) {

          var test = original.match(/^#([A-F0-9]{6})$/i);
          if (test === null) return false;

          return {
            space: 'HEX',
            hex: parseInt('0x' + test[1].toString())
          };
        },

        write: toString

      },

      CSS_RGB: {

        read: function read(original) {

          var test = original.match(/^rgb\(\s*(.+)\s*,\s*(.+)\s*,\s*(.+)\s*\)/);
          if (test === null) return false;

          return {
            space: 'RGB',
            r: parseFloat(test[1]),
            g: parseFloat(test[2]),
            b: parseFloat(test[3])
          };
        },

        write: toString

      },

      CSS_RGBA: {

        read: function read(original) {

          var test = original.match(/^rgba\(\s*(.+)\s*,\s*(.+)\s*,\s*(.+)\s*\,\s*(.+)\s*\)/);
          if (test === null) return false;

          return {
            space: 'RGB',
            r: parseFloat(test[1]),
            g: parseFloat(test[2]),
            b: parseFloat(test[3]),
            a: parseFloat(test[4])
          };
        },

        write: toString

      }

    }

  },

  // Numbers
  {

    litmus: common.isNumber,

    conversions: {

      HEX: {
        read: function read(original) {
          return {
            space: 'HEX',
            hex: original,
            conversionName: 'HEX'
          };
        },

        write: function write(color) {
          return color.hex;
        }
      }

    }

  },

  // Arrays
  {

    litmus: common.isArray,

    conversions: {

      RGB_ARRAY: {
        read: function read(original) {
          if (original.length != 3) return false;
          return {
            space: 'RGB',
            r: original[0],
            g: original[1],
            b: original[2]
          };
        },

        write: function write(color) {
          return [color.r, color.g, color.b];
        }

      },

      RGBA_ARRAY: {
        read: function read(original) {
          if (original.length != 4) return false;
          return {
            space: 'RGB',
            r: original[0],
            g: original[1],
            b: original[2],
            a: original[3]
          };
        },

        write: function write(color) {
          return [color.r, color.g, color.b, color.a];
        }

      }

    }

  },

  // Objects
  {

    litmus: common.isObject,

    conversions: {

      RGBA_OBJ: {
        read: function read(original) {
          if (common.isNumber(original.r) && common.isNumber(original.g) && common.isNumber(original.b) && common.isNumber(original.a)) {
            return {
              space: 'RGB',
              r: original.r,
              g: original.g,
              b: original.b,
              a: original.a
            };
          }
          return false;
        },

        write: function write(color) {
          return {
            r: color.r,
            g: color.g,
            b: color.b,
            a: color.a
          };
        }
      },

      RGB_OBJ: {
        read: function read(original) {
          if (common.isNumber(original.r) && common.isNumber(original.g) && common.isNumber(original.b)) {
            return {
              space: 'RGB',
              r: original.r,
              g: original.g,
              b: original.b
            };
          }
          return false;
        },

        write: function write(color) {
          return {
            r: color.r,
            g: color.g,
            b: color.b
          };
        }
      },

      HSVA_OBJ: {
        read: function read(original) {
          if (common.isNumber(original.h) && common.isNumber(original.s) && common.isNumber(original.v) && common.isNumber(original.a)) {
            return {
              space: 'HSV',
              h: original.h,
              s: original.s,
              v: original.v,
              a: original.a
            };
          }
          return false;
        },

        write: function write(color) {
          return {
            h: color.h,
            s: color.s,
            v: color.v,
            a: color.a
          };
        }
      },

      HSV_OBJ: {
        read: function read(original) {
          if (common.isNumber(original.h) && common.isNumber(original.s) && common.isNumber(original.v)) {
            return {
              space: 'HSV',
              h: original.h,
              s: original.s,
              v: original.v
            };
          }
          return false;
        },

        write: function write(color) {
          return {
            h: color.h,
            s: color.s,
            v: color.v
          };
        }

      }

    }

  }];

  return interpret;
}(dat.color.toString, dat.utils.common);

dat.GUI = dat.gui.GUI = function (css, saveDialogueContents, styleSheet, controllerFactory, Controller, BooleanController, FunctionController, NumberControllerBox, NumberControllerSlider, OptionController, ColorController, requestAnimationFrame, CenteredDiv, dom, common) {

  css.inject(styleSheet);

  /** Outer-most className for GUI's */
  var CSS_NAMESPACE = 'dg';

  var HIDE_KEY_CODE = 72;

  /** The only value shared between the JS and SCSS. Use caution. */
  var CLOSE_BUTTON_HEIGHT = 20;

  var DEFAULT_DEFAULT_PRESET_NAME = 'Default';

  var SUPPORTS_LOCAL_STORAGE = function () {
    try {
      return 'localStorage' in window && window['localStorage'] !== null;
    } catch (e) {
      return false;
    }
  }();

  var SAVE_DIALOGUE;

  /** Have we yet to create an autoPlace GUI? */
  var auto_place_virgin = true;

  /** Fixed position div that auto place GUI's go inside */
  var auto_place_container;

  /** Are we hiding the GUI's ? */
  var hide = false;

  /** GUI's which should be hidden */
  var hideable_guis = [];

  /**
   * A lightweight controller library for JavaScript. It allows you to easily
   * manipulate variables and fire functions on the fly.
   * @class
   *
   * @member dat.gui
   *
   * @param {Object} [params]
   * @param {String} [params.name] The name of this GUI.
   * @param {Object} [params.load] JSON object representing the saved state of
   * this GUI.
   * @param {Boolean} [params.auto=true]
   * @param {dat.gui.GUI} [params.parent] The GUI I'm nested in.
   * @param {Boolean} [params.closed] If true, starts closed
   */
  var GUI = function GUI(params) {

    var _this = this;

    /**
     * Outermost DOM Element
     * @type DOMElement
     */
    this.domElement = document.createElement('div');
    this.__ul = document.createElement('ul');
    this.domElement.appendChild(this.__ul);

    dom.addClass(this.domElement, CSS_NAMESPACE);

    /**
     * Nested GUI's by name
     * @ignore
     */
    this.__folders = {};

    this.__controllers = [];

    /**
     * List of objects I'm remembering for save, only used in top level GUI
     * @ignore
     */
    this.__rememberedObjects = [];

    /**
     * Maps the index of remembered objects to a map of controllers, only used
     * in top level GUI.
     *
     * @private
     * @ignore
     *
     * @example
     * [
     *  {
     *    propertyName: Controller,
     *    anotherPropertyName: Controller
     *  },
     *  {
     *    propertyName: Controller
     *  }
     * ]
     */
    this.__rememberedObjectIndecesToControllers = [];

    this.__listening = [];

    params = params || {};

    // Default parameters
    params = common.defaults(params, {
      autoPlace: true,
      width: GUI.DEFAULT_WIDTH
    });

    params = common.defaults(params, {
      resizable: params.autoPlace,
      hideable: params.autoPlace
    });

    if (!common.isUndefined(params.load)) {

      // Explicit preset
      if (params.preset) params.load.preset = params.preset;
    } else {

      params.load = { preset: DEFAULT_DEFAULT_PRESET_NAME };
    }

    if (common.isUndefined(params.parent) && params.hideable) {
      hideable_guis.push(this);
    }

    // Only root level GUI's are resizable.
    params.resizable = common.isUndefined(params.parent) && params.resizable;

    if (params.autoPlace && common.isUndefined(params.scrollable)) {
      params.scrollable = true;
    }
    //    params.scrollable = common.isUndefined(params.parent) && params.scrollable === true;

    // Not part of params because I don't want people passing this in via
    // constructor. Should be a 'remembered' value.
    var use_local_storage = SUPPORTS_LOCAL_STORAGE && localStorage.getItem(getLocalStorageHash(this, 'isLocal')) === 'true';

    Object.defineProperties(this,

    /** @lends dat.gui.GUI.prototype */
    {

      /**
       * The parent <code>GUI</code>
       * @type dat.gui.GUI
       */
      parent: {
        get: function get() {
          return params.parent;
        }
      },

      scrollable: {
        get: function get() {
          return params.scrollable;
        }
      },

      /**
       * Handles <code>GUI</code>'s element placement for you
       * @type Boolean
       */
      autoPlace: {
        get: function get() {
          return params.autoPlace;
        }
      },

      /**
       * The identifier for a set of saved values
       * @type String
       */
      preset: {

        get: function get() {
          if (_this.parent) {
            return _this.getRoot().preset;
          } else {
            return params.load.preset;
          }
        },

        set: function set(v) {
          if (_this.parent) {
            _this.getRoot().preset = v;
          } else {
            params.load.preset = v;
          }
          setPresetSelectIndex(this);
          _this.revert();
        }

      },

      /**
       * The width of <code>GUI</code> element
       * @type Number
       */
      width: {
        get: function get() {
          return params.width;
        },
        set: function set(v) {
          params.width = v;
          setWidth(_this, v);
        }
      },

      /**
       * The name of <code>GUI</code>. Used for folders. i.e
       * a folder's name
       * @type String
       */
      name: {
        get: function get() {
          return params.name;
        },
        set: function set(v) {
          // TODO Check for collisions among sibling folders
          params.name = v;
          if (title_row_name) {
            title_row_name.innerHTML = params.name;
          }
        }
      },

      /**
       * Whether the <code>GUI</code> is collapsed or not
       * @type Boolean
       */
      closed: {
        get: function get() {
          return params.closed;
        },
        set: function set(v) {
          params.closed = v;
          if (params.closed) {
            dom.addClass(_this.__ul, GUI.CLASS_CLOSED);
          } else {
            dom.removeClass(_this.__ul, GUI.CLASS_CLOSED);
          }
          // For browsers that aren't going to respect the CSS transition,
          // Lets just check our height against the window height right off
          // the bat.
          this.onResize();

          if (_this.__closeButton) {
            _this.__closeButton.innerHTML = v ? GUI.TEXT_OPEN : GUI.TEXT_CLOSED;
          }
        }
      },

      /**
       * Contains all presets
       * @type Object
       */
      load: {
        get: function get() {
          return params.load;
        }
      },

      /**
       * Determines whether or not to use <a href="https://developer.mozilla.org/en/DOM/Storage#localStorage">localStorage</a> as the means for
       * <code>remember</code>ing
       * @type Boolean
       */
      useLocalStorage: {

        get: function get() {
          return use_local_storage;
        },
        set: function set(bool) {
          if (SUPPORTS_LOCAL_STORAGE) {
            use_local_storage = bool;
            if (bool) {
              dom.bind(window, 'unload', saveToLocalStorage);
            } else {
              dom.unbind(window, 'unload', saveToLocalStorage);
            }
            localStorage.setItem(getLocalStorageHash(_this, 'isLocal'), bool);
          }
        }

      }

    });

    // Are we a root level GUI?
    if (common.isUndefined(params.parent)) {

      params.closed = false;

      dom.addClass(this.domElement, GUI.CLASS_MAIN);
      dom.makeSelectable(this.domElement, false);

      // Are we supposed to be loading locally?
      if (SUPPORTS_LOCAL_STORAGE) {

        if (use_local_storage) {

          _this.useLocalStorage = true;

          var saved_gui = localStorage.getItem(getLocalStorageHash(this, 'gui'));

          if (saved_gui) {
            params.load = JSON.parse(saved_gui);
          }
        }
      }

      this.__closeButton = document.createElement('div');
      this.__closeButton.innerHTML = GUI.TEXT_CLOSED;
      dom.addClass(this.__closeButton, GUI.CLASS_CLOSE_BUTTON);
      this.domElement.appendChild(this.__closeButton);

      dom.bind(this.__closeButton, 'click', function () {

        _this.closed = !_this.closed;
      });

      // Oh, you're a nested GUI!
    } else {

      if (params.closed === undefined) {
        params.closed = true;
      }

      var title_row_name = document.createTextNode(params.name);
      dom.addClass(title_row_name, 'controller-name');

      var title_row = addRow(_this, title_row_name);

      var on_click_title = function on_click_title(e) {
        e.preventDefault();
        _this.closed = !_this.closed;
        return false;
      };

      dom.addClass(this.__ul, GUI.CLASS_CLOSED);

      dom.addClass(title_row, 'title');
      dom.bind(title_row, 'click', on_click_title);

      if (!params.closed) {
        this.closed = false;
      }
    }

    if (params.autoPlace) {

      if (common.isUndefined(params.parent)) {

        if (auto_place_virgin) {
          auto_place_container = document.createElement('div');
          dom.addClass(auto_place_container, CSS_NAMESPACE);
          dom.addClass(auto_place_container, GUI.CLASS_AUTO_PLACE_CONTAINER);
          document.body.appendChild(auto_place_container);
          auto_place_virgin = false;
        }

        // Put it in the dom for you.
        auto_place_container.appendChild(this.domElement);

        // Apply the auto styles
        dom.addClass(this.domElement, GUI.CLASS_AUTO_PLACE);
      }

      // Make it not elastic.
      if (!this.parent) setWidth(_this, params.width);
    }

    dom.bind(window, 'resize', function () {
      _this.onResize();
    });
    dom.bind(this.__ul, 'webkitTransitionEnd', function () {
      _this.onResize();
    });
    dom.bind(this.__ul, 'transitionend', function () {
      _this.onResize();
    });
    dom.bind(this.__ul, 'oTransitionEnd', function () {
      _this.onResize();
    });
    this.onResize();

    if (params.resizable) {
      addResizeHandle(this);
    }

    function saveToLocalStorage() {
      localStorage.setItem(getLocalStorageHash(_this, 'gui'), JSON.stringify(_this.getSaveObject()));
    }

    var root = _this.getRoot();
    function resetWidth() {
      var root = _this.getRoot();
      root.width += 1;
      common.defer(function () {
        root.width -= 1;
      });
    }

    if (!params.parent) {
      resetWidth();
    }
  };

  GUI.toggleHide = function () {

    hide = !hide;
    common.each(hideable_guis, function (gui) {
      gui.domElement.style.zIndex = hide ? -999 : 999;
      gui.domElement.style.opacity = hide ? 0 : 1;
    });
  };

  GUI.CLASS_AUTO_PLACE = 'a';
  GUI.CLASS_AUTO_PLACE_CONTAINER = 'ac';
  GUI.CLASS_MAIN = 'main';
  GUI.CLASS_CONTROLLER_ROW = 'cr';
  GUI.CLASS_TOO_TALL = 'taller-than-window';
  GUI.CLASS_CLOSED = 'closed';
  GUI.CLASS_CLOSE_BUTTON = 'close-button';
  GUI.CLASS_DRAG = 'drag';

  GUI.DEFAULT_WIDTH = 245;
  GUI.TEXT_CLOSED = 'Close Controls';
  GUI.TEXT_OPEN = 'Open Controls';

  dom.bind(window, 'keydown', function (e) {

    if (document.activeElement.type !== 'text' && (e.which === HIDE_KEY_CODE || e.keyCode == HIDE_KEY_CODE)) {
      GUI.toggleHide();
    }
  }, false);

  common.extend(GUI.prototype,

  /** @lends dat.gui.GUI */
  {

    /**
     * @param object
     * @param property
     * @returns {dat.controllers.Controller} The new controller that was added.
     * @instance
     */
    add: function add(object, property) {

      return _add(this, object, property, {
        factoryArgs: Array.prototype.slice.call(arguments, 2)
      });
    },

    /**
     * @param object
     * @param property
     * @returns {dat.controllers.ColorController} The new controller that was added.
     * @instance
     */
    addColor: function addColor(object, property) {

      return _add(this, object, property, {
        color: true
      });
    },

    /**
     * @param controller
     * @instance
     */
    remove: function remove(controller) {

      // TODO listening?
      this.__ul.removeChild(controller.__li);
      this.__controllers.slice(this.__controllers.indexOf(controller), 1);
      var _this = this;
      common.defer(function () {
        _this.onResize();
      });
    },

    destroy: function destroy() {

      if (this.autoPlace) {
        auto_place_container.removeChild(this.domElement);
      }
    },

    /**
     * @param name
     * @returns {dat.gui.GUI} The new folder.
     * @throws {Error} if this GUI already has a folder by the specified
     * name
     * @instance
     */
    addFolder: function addFolder(name) {

      // We have to prevent collisions on names in order to have a key
      // by which to remember saved values
      if (this.__folders[name] !== undefined) {
        throw new Error('You already have a folder in this GUI by the' + ' name "' + name + '"');
      }

      var new_gui_params = { name: name, parent: this };

      // We need to pass down the autoPlace trait so that we can
      // attach event listeners to open/close folder actions to
      // ensure that a scrollbar appears if the window is too short.
      new_gui_params.autoPlace = this.autoPlace;

      // Do we have saved appearance data for this folder?

      if (this.load && // Anything loaded?
      this.load.folders && // Was my parent a dead-end?
      this.load.folders[name]) {
        // Did daddy remember me?

        // Start me closed if I was closed
        new_gui_params.closed = this.load.folders[name].closed;

        // Pass down the loaded data
        new_gui_params.load = this.load.folders[name];
      }

      var gui = new GUI(new_gui_params);
      this.__folders[name] = gui;

      var li = addRow(this, gui.domElement);
      dom.addClass(li, 'folder');
      return gui;
    },

    open: function open() {
      this.closed = false;
    },

    close: function close() {
      this.closed = true;
    },

    onResize: function onResize() {

      var root = this.getRoot();

      if (root.scrollable) {

        var top = dom.getOffset(root.__ul).top;
        var h = 0;

        common.each(root.__ul.childNodes, function (node) {
          if (!(root.autoPlace && node === root.__save_row)) h += dom.getHeight(node);
        });

        if (window.innerHeight - top - CLOSE_BUTTON_HEIGHT < h) {
          dom.addClass(root.domElement, GUI.CLASS_TOO_TALL);
          root.__ul.style.height = window.innerHeight - top - CLOSE_BUTTON_HEIGHT + 'px';
        } else {
          dom.removeClass(root.domElement, GUI.CLASS_TOO_TALL);
          root.__ul.style.height = 'auto';
        }
      }

      if (root.__resize_handle) {
        common.defer(function () {
          root.__resize_handle.style.height = root.__ul.offsetHeight + 'px';
        });
      }

      if (root.__closeButton) {
        root.__closeButton.style.width = root.width + 'px';
      }
    },

    /**
     * Mark objects for saving. The order of these objects cannot change as
     * the GUI grows. When remembering new objects, append them to the end
     * of the list.
     *
     * @param {Object...} objects
     * @throws {Error} if not called on a top level GUI.
     * @instance
     */
    remember: function remember() {

      if (common.isUndefined(SAVE_DIALOGUE)) {
        SAVE_DIALOGUE = new CenteredDiv();
        SAVE_DIALOGUE.domElement.innerHTML = saveDialogueContents;
      }

      if (this.parent) {
        throw new Error("You can only call remember on a top level GUI.");
      }

      var _this = this;

      common.each(Array.prototype.slice.call(arguments), function (object) {
        if (_this.__rememberedObjects.length == 0) {
          addSaveMenu(_this);
        }
        if (_this.__rememberedObjects.indexOf(object) == -1) {
          _this.__rememberedObjects.push(object);
        }
      });

      if (this.autoPlace) {
        // Set save row width
        setWidth(this, this.width);
      }
    },

    /**
     * @returns {dat.gui.GUI} the topmost parent GUI of a nested GUI.
     * @instance
     */
    getRoot: function getRoot() {
      var gui = this;
      while (gui.parent) {
        gui = gui.parent;
      }
      return gui;
    },

    /**
     * @returns {Object} a JSON object representing the current state of
     * this GUI as well as its remembered properties.
     * @instance
     */
    getSaveObject: function getSaveObject() {

      var toReturn = this.load;

      toReturn.closed = this.closed;

      // Am I remembering any values?
      if (this.__rememberedObjects.length > 0) {

        toReturn.preset = this.preset;

        if (!toReturn.remembered) {
          toReturn.remembered = {};
        }

        toReturn.remembered[this.preset] = getCurrentPreset(this);
      }

      toReturn.folders = {};
      common.each(this.__folders, function (element, key) {
        toReturn.folders[key] = element.getSaveObject();
      });

      return toReturn;
    },

    save: function save() {

      if (!this.load.remembered) {
        this.load.remembered = {};
      }

      this.load.remembered[this.preset] = getCurrentPreset(this);
      markPresetModified(this, false);
    },

    saveAs: function saveAs(presetName) {

      if (!this.load.remembered) {

        // Retain default values upon first save
        this.load.remembered = {};
        this.load.remembered[DEFAULT_DEFAULT_PRESET_NAME] = getCurrentPreset(this, true);
      }

      this.load.remembered[presetName] = getCurrentPreset(this);
      this.preset = presetName;
      addPresetOption(this, presetName, true);
    },

    revert: function revert(gui) {

      common.each(this.__controllers, function (controller) {
        // Make revert work on Default.
        if (!this.getRoot().load.remembered) {
          controller.setValue(controller.initialValue);
        } else {
          recallSavedValue(gui || this.getRoot(), controller);
        }
      }, this);

      common.each(this.__folders, function (folder) {
        folder.revert(folder);
      });

      if (!gui) {
        markPresetModified(this.getRoot(), false);
      }
    },

    listen: function listen(controller) {

      var init = this.__listening.length == 0;
      this.__listening.push(controller);
      if (init) updateDisplays(this.__listening);
    }

  });

  function _add(gui, object, property, params) {

    if (object[property] === undefined) {
      throw new Error("Object " + object + " has no property \"" + property + "\"");
    }

    var controller;

    if (params.color) {

      controller = new ColorController(object, property);
    } else {

      var factoryArgs = [object, property].concat(params.factoryArgs);
      controller = controllerFactory.apply(gui, factoryArgs);
    }

    if (params.before instanceof Controller) {
      params.before = params.before.__li;
    }

    recallSavedValue(gui, controller);

    dom.addClass(controller.domElement, 'c');

    var name = document.createElement('span');
    dom.addClass(name, 'property-name');
    name.innerHTML = controller.property;

    var container = document.createElement('div');
    container.appendChild(name);
    container.appendChild(controller.domElement);

    var li = addRow(gui, container, params.before);

    dom.addClass(li, GUI.CLASS_CONTROLLER_ROW);
    dom.addClass(li, _typeof(controller.getValue()));

    augmentController(gui, li, controller);

    gui.__controllers.push(controller);

    return controller;
  }

  /**
   * Add a row to the end of the GUI or before another row.
   *
   * @param gui
   * @param [dom] If specified, inserts the dom content in the new row
   * @param [liBefore] If specified, places the new row before another row
   */
  function addRow(gui, dom, liBefore) {
    var li = document.createElement('li');
    if (dom) li.appendChild(dom);
    if (liBefore) {
      gui.__ul.insertBefore(li, params.before);
    } else {
      gui.__ul.appendChild(li);
    }
    gui.onResize();
    return li;
  }

  function augmentController(gui, li, controller) {

    controller.__li = li;
    controller.__gui = gui;

    common.extend(controller, {

      options: function options(_options) {

        if (arguments.length > 1) {
          controller.remove();

          return _add(gui, controller.object, controller.property, {
            before: controller.__li.nextElementSibling,
            factoryArgs: [common.toArray(arguments)]
          });
        }

        if (common.isArray(_options) || common.isObject(_options)) {
          controller.remove();

          return _add(gui, controller.object, controller.property, {
            before: controller.__li.nextElementSibling,
            factoryArgs: [_options]
          });
        }
      },

      name: function name(v) {
        controller.__li.firstElementChild.firstElementChild.innerHTML = v;
        return controller;
      },

      listen: function listen() {
        controller.__gui.listen(controller);
        return controller;
      },

      remove: function remove() {
        controller.__gui.remove(controller);
        return controller;
      }

    });

    // All sliders should be accompanied by a box.
    if (controller instanceof NumberControllerSlider) {

      var box = new NumberControllerBox(controller.object, controller.property, { min: controller.__min, max: controller.__max, step: controller.__step });

      common.each(['updateDisplay', 'onChange', 'onFinishChange'], function (method) {
        var pc = controller[method];
        var pb = box[method];
        controller[method] = box[method] = function () {
          var args = Array.prototype.slice.call(arguments);
          pc.apply(controller, args);
          return pb.apply(box, args);
        };
      });

      dom.addClass(li, 'has-slider');
      controller.domElement.insertBefore(box.domElement, controller.domElement.firstElementChild);
    } else if (controller instanceof NumberControllerBox) {

      var r = function r(returned) {

        // Have we defined both boundaries?
        if (common.isNumber(controller.__min) && common.isNumber(controller.__max)) {

          // Well, then lets just replace this with a slider.
          controller.remove();
          return _add(gui, controller.object, controller.property, {
            before: controller.__li.nextElementSibling,
            factoryArgs: [controller.__min, controller.__max, controller.__step]
          });
        }

        return returned;
      };

      controller.min = common.compose(r, controller.min);
      controller.max = common.compose(r, controller.max);
    } else if (controller instanceof BooleanController) {

      dom.bind(li, 'click', function () {
        dom.fakeEvent(controller.__checkbox, 'click');
      });

      dom.bind(controller.__checkbox, 'click', function (e) {
        e.stopPropagation(); // Prevents double-toggle
      });
    } else if (controller instanceof FunctionController) {

      dom.bind(li, 'click', function () {
        dom.fakeEvent(controller.__button, 'click');
      });

      dom.bind(li, 'mouseover', function () {
        dom.addClass(controller.__button, 'hover');
      });

      dom.bind(li, 'mouseout', function () {
        dom.removeClass(controller.__button, 'hover');
      });
    } else if (controller instanceof ColorController) {

      dom.addClass(li, 'color');
      controller.updateDisplay = common.compose(function (r) {
        li.style.borderLeftColor = controller.__color.toString();
        return r;
      }, controller.updateDisplay);

      controller.updateDisplay();
    }

    controller.setValue = common.compose(function (r) {
      if (gui.getRoot().__preset_select && controller.isModified()) {
        markPresetModified(gui.getRoot(), true);
      }
      return r;
    }, controller.setValue);
  }

  function recallSavedValue(gui, controller) {

    // Find the topmost GUI, that's where remembered objects live.
    var root = gui.getRoot();

    // Does the object we're controlling match anything we've been told to
    // remember?
    var matched_index = root.__rememberedObjects.indexOf(controller.object);

    // Why yes, it does!
    if (matched_index != -1) {

      // Let me fetch a map of controllers for thcommon.isObject.
      var controller_map = root.__rememberedObjectIndecesToControllers[matched_index];

      // Ohp, I believe this is the first controller we've created for this
      // object. Lets make the map fresh.
      if (controller_map === undefined) {
        controller_map = {};
        root.__rememberedObjectIndecesToControllers[matched_index] = controller_map;
      }

      // Keep track of this controller
      controller_map[controller.property] = controller;

      // Okay, now have we saved any values for this controller?
      if (root.load && root.load.remembered) {

        var preset_map = root.load.remembered;

        // Which preset are we trying to load?
        var preset;

        if (preset_map[gui.preset]) {

          preset = preset_map[gui.preset];
        } else if (preset_map[DEFAULT_DEFAULT_PRESET_NAME]) {

          // Uhh, you can have the default instead?
          preset = preset_map[DEFAULT_DEFAULT_PRESET_NAME];
        } else {

          // Nada.

          return;
        }

        // Did the loaded object remember thcommon.isObject?
        if (preset[matched_index] &&

        // Did we remember this particular property?
        preset[matched_index][controller.property] !== undefined) {

          // We did remember something for this guy ...
          var value = preset[matched_index][controller.property];

          // And that's what it is.
          controller.initialValue = value;
          controller.setValue(value);
        }
      }
    }
  }

  function getLocalStorageHash(gui, key) {
    // TODO how does this deal with multiple GUI's?
    return document.location.href + '.' + key;
  }

  function addSaveMenu(gui) {

    var div = gui.__save_row = document.createElement('li');

    dom.addClass(gui.domElement, 'has-save');

    gui.__ul.insertBefore(div, gui.__ul.firstChild);

    dom.addClass(div, 'save-row');

    var gears = document.createElement('span');
    gears.innerHTML = '&nbsp;';
    dom.addClass(gears, 'button gears');

    // TODO replace with FunctionController
    var button = document.createElement('span');
    button.innerHTML = 'Save';
    dom.addClass(button, 'button');
    dom.addClass(button, 'save');

    var button2 = document.createElement('span');
    button2.innerHTML = 'New';
    dom.addClass(button2, 'button');
    dom.addClass(button2, 'save-as');

    var button3 = document.createElement('span');
    button3.innerHTML = 'Revert';
    dom.addClass(button3, 'button');
    dom.addClass(button3, 'revert');

    var select = gui.__preset_select = document.createElement('select');

    if (gui.load && gui.load.remembered) {

      common.each(gui.load.remembered, function (value, key) {
        addPresetOption(gui, key, key == gui.preset);
      });
    } else {
      addPresetOption(gui, DEFAULT_DEFAULT_PRESET_NAME, false);
    }

    dom.bind(select, 'change', function () {

      for (var index = 0; index < gui.__preset_select.length; index++) {
        gui.__preset_select[index].innerHTML = gui.__preset_select[index].value;
      }

      gui.preset = this.value;
    });

    div.appendChild(select);
    div.appendChild(gears);
    div.appendChild(button);
    div.appendChild(button2);
    div.appendChild(button3);

    if (SUPPORTS_LOCAL_STORAGE) {
      var showHideExplain = function showHideExplain() {
        explain.style.display = gui.useLocalStorage ? 'block' : 'none';
      };

      var saveLocally = document.getElementById('dg-save-locally');
      var explain = document.getElementById('dg-local-explain');

      saveLocally.style.display = 'block';

      var localStorageCheckBox = document.getElementById('dg-local-storage');

      if (localStorage.getItem(getLocalStorageHash(gui, 'isLocal')) === 'true') {
        localStorageCheckBox.setAttribute('checked', 'checked');
      }

      showHideExplain();

      // TODO: Use a boolean controller, fool!
      dom.bind(localStorageCheckBox, 'change', function () {
        gui.useLocalStorage = !gui.useLocalStorage;
        showHideExplain();
      });
    }

    var newConstructorTextArea = document.getElementById('dg-new-constructor');

    dom.bind(newConstructorTextArea, 'keydown', function (e) {
      if (e.metaKey && (e.which === 67 || e.keyCode == 67)) {
        SAVE_DIALOGUE.hide();
      }
    });

    dom.bind(gears, 'click', function () {
      newConstructorTextArea.innerHTML = JSON.stringify(gui.getSaveObject(), undefined, 2);
      SAVE_DIALOGUE.show();
      newConstructorTextArea.focus();
      newConstructorTextArea.select();
    });

    dom.bind(button, 'click', function () {
      gui.save();
    });

    dom.bind(button2, 'click', function () {
      var presetName = prompt('Enter a new preset name.');
      if (presetName) gui.saveAs(presetName);
    });

    dom.bind(button3, 'click', function () {
      gui.revert();
    });

    //    div.appendChild(button2);
  }

  function addResizeHandle(gui) {

    gui.__resize_handle = document.createElement('div');

    common.extend(gui.__resize_handle.style, {

      width: '6px',
      marginLeft: '-3px',
      height: '200px',
      cursor: 'ew-resize',
      position: 'absolute'
      //      border: '1px solid blue'

    });

    var pmouseX;

    dom.bind(gui.__resize_handle, 'mousedown', dragStart);
    dom.bind(gui.__closeButton, 'mousedown', dragStart);

    gui.domElement.insertBefore(gui.__resize_handle, gui.domElement.firstElementChild);

    function dragStart(e) {

      e.preventDefault();

      pmouseX = e.clientX;

      dom.addClass(gui.__closeButton, GUI.CLASS_DRAG);
      dom.bind(window, 'mousemove', drag);
      dom.bind(window, 'mouseup', dragStop);

      return false;
    }

    function drag(e) {

      e.preventDefault();

      gui.width += pmouseX - e.clientX;
      gui.onResize();
      pmouseX = e.clientX;

      return false;
    }

    function dragStop() {

      dom.removeClass(gui.__closeButton, GUI.CLASS_DRAG);
      dom.unbind(window, 'mousemove', drag);
      dom.unbind(window, 'mouseup', dragStop);
    }
  }

  function setWidth(gui, w) {
    gui.domElement.style.width = w + 'px';
    // Auto placed save-rows are position fixed, so we have to
    // set the width manually if we want it to bleed to the edge
    if (gui.__save_row && gui.autoPlace) {
      gui.__save_row.style.width = w + 'px';
    }if (gui.__closeButton) {
      gui.__closeButton.style.width = w + 'px';
    }
  }

  function getCurrentPreset(gui, useInitialValues) {

    var toReturn = {};

    // For each object I'm remembering
    common.each(gui.__rememberedObjects, function (val, index) {

      var saved_values = {};

      // The controllers I've made for thcommon.isObject by property
      var controller_map = gui.__rememberedObjectIndecesToControllers[index];

      // Remember each value for each property
      common.each(controller_map, function (controller, property) {
        saved_values[property] = useInitialValues ? controller.initialValue : controller.getValue();
      });

      // Save the values for thcommon.isObject
      toReturn[index] = saved_values;
    });

    return toReturn;
  }

  function addPresetOption(gui, name, setSelected) {
    var opt = document.createElement('option');
    opt.innerHTML = name;
    opt.value = name;
    gui.__preset_select.appendChild(opt);
    if (setSelected) {
      gui.__preset_select.selectedIndex = gui.__preset_select.length - 1;
    }
  }

  function setPresetSelectIndex(gui) {
    for (var index = 0; index < gui.__preset_select.length; index++) {
      if (gui.__preset_select[index].value == gui.preset) {
        gui.__preset_select.selectedIndex = index;
      }
    }
  }

  function markPresetModified(gui, modified) {
    var opt = gui.__preset_select[gui.__preset_select.selectedIndex];
    //    console.log('mark', modified, opt);
    if (modified) {
      opt.innerHTML = opt.value + "*";
    } else {
      opt.innerHTML = opt.value;
    }
  }

  function updateDisplays(controllerArray) {

    if (controllerArray.length != 0) {

      requestAnimationFrame(function () {
        updateDisplays(controllerArray);
      });
    }

    common.each(controllerArray, function (c) {
      c.updateDisplay();
    });
  }

  return GUI;
}(dat.utils.css, "<div id=\"dg-save\" class=\"dg dialogue\">\n\n  Here's the new load parameter for your <code>GUI</code>'s constructor:\n\n  <textarea id=\"dg-new-constructor\"></textarea>\n\n  <div id=\"dg-save-locally\">\n\n    <input id=\"dg-local-storage\" type=\"checkbox\"/> Automatically save\n    values to <code>localStorage</code> on exit.\n\n    <div id=\"dg-local-explain\">The values saved to <code>localStorage</code> will\n      override those passed to <code>dat.GUI</code>'s constructor. This makes it\n      easier to work incrementally, but <code>localStorage</code> is fragile,\n      and your friends may not see the same values you do.\n      \n    </div>\n    \n  </div>\n\n</div>", ".dg ul{list-style:none;margin:0;padding:0;width:100%;clear:both}.dg.ac{position:fixed;top:0;left:0;right:0;height:0;z-index:0}.dg:not(.ac) .main{overflow:hidden}.dg.main{-webkit-transition:opacity 0.1s linear;-o-transition:opacity 0.1s linear;-moz-transition:opacity 0.1s linear;transition:opacity 0.1s linear}.dg.main.taller-than-window{overflow-y:auto}.dg.main.taller-than-window .close-button{opacity:1;margin-top:-1px;border-top:1px solid #2c2c2c}.dg.main ul.closed .close-button{opacity:1 !important}.dg.main:hover .close-button,.dg.main .close-button.drag{opacity:1}.dg.main .close-button{-webkit-transition:opacity 0.1s linear;-o-transition:opacity 0.1s linear;-moz-transition:opacity 0.1s linear;transition:opacity 0.1s linear;border:0;position:absolute;line-height:19px;height:20px;cursor:pointer;text-align:center;background-color:#000}.dg.main .close-button:hover{background-color:#111}.dg.a{float:right;margin-right:15px;overflow-x:hidden}.dg.a.has-save ul{margin-top:27px}.dg.a.has-save ul.closed{margin-top:0}.dg.a .save-row{position:fixed;top:0;z-index:1002}.dg li{-webkit-transition:height 0.1s ease-out;-o-transition:height 0.1s ease-out;-moz-transition:height 0.1s ease-out;transition:height 0.1s ease-out}.dg li:not(.folder){cursor:auto;height:27px;line-height:27px;overflow:hidden;padding:0 4px 0 5px}.dg li.folder{padding:0;border-left:4px solid rgba(0,0,0,0)}.dg li.title{cursor:pointer;margin-left:-4px}.dg .closed li:not(.title),.dg .closed ul li,.dg .closed ul li > *{height:0;overflow:hidden;border:0}.dg .cr{clear:both;padding-left:3px;height:27px}.dg .property-name{cursor:default;float:left;clear:left;width:40%;overflow:hidden;text-overflow:ellipsis}.dg .c{float:left;width:60%}.dg .c input[type=text]{border:0;margin-top:4px;padding:3px;width:100%;float:right}.dg .has-slider input[type=text]{width:30%;margin-left:0}.dg .slider{float:left;width:66%;margin-left:-5px;margin-right:0;height:19px;margin-top:4px}.dg .slider-fg{height:100%}.dg .c input[type=checkbox]{margin-top:9px}.dg .c select{margin-top:5px}.dg .cr.function,.dg .cr.function .property-name,.dg .cr.function *,.dg .cr.boolean,.dg .cr.boolean *{cursor:pointer}.dg .selector{display:none;position:absolute;margin-left:-9px;margin-top:23px;z-index:10}.dg .c:hover .selector,.dg .selector.drag{display:block}.dg li.save-row{padding:0}.dg li.save-row .button{display:inline-block;padding:0px 6px}.dg.dialogue{background-color:#222;width:460px;padding:15px;font-size:13px;line-height:15px}#dg-new-constructor{padding:10px;color:#222;font-family:Monaco, monospace;font-size:10px;border:0;resize:none;box-shadow:inset 1px 1px 1px #888;word-wrap:break-word;margin:12px 0;display:block;width:440px;overflow-y:scroll;height:100px;position:relative}#dg-local-explain{display:none;font-size:11px;line-height:17px;border-radius:3px;background-color:#333;padding:8px;margin-top:10px}#dg-local-explain code{font-size:10px}#dat-gui-save-locally{display:none}.dg{color:#eee;font:11px 'Lucida Grande', sans-serif;text-shadow:0 -1px 0 #111}.dg.main::-webkit-scrollbar{width:5px;background:#1a1a1a}.dg.main::-webkit-scrollbar-corner{height:0;display:none}.dg.main::-webkit-scrollbar-thumb{border-radius:5px;background:#676767}.dg li:not(.folder){background:#1a1a1a;border-bottom:1px solid #2c2c2c}.dg li.save-row{line-height:25px;background:#dad5cb;border:0}.dg li.save-row select{margin-left:5px;width:108px}.dg li.save-row .button{margin-left:5px;margin-top:1px;border-radius:2px;font-size:9px;line-height:7px;padding:4px 4px 5px 4px;background:#c5bdad;color:#fff;text-shadow:0 1px 0 #b0a58f;box-shadow:0 -1px 0 #b0a58f;cursor:pointer}.dg li.save-row .button.gears{background:#c5bdad url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAsAAAANCAYAAAB/9ZQ7AAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAQJJREFUeNpiYKAU/P//PwGIC/ApCABiBSAW+I8AClAcgKxQ4T9hoMAEUrxx2QSGN6+egDX+/vWT4e7N82AMYoPAx/evwWoYoSYbACX2s7KxCxzcsezDh3evFoDEBYTEEqycggWAzA9AuUSQQgeYPa9fPv6/YWm/Acx5IPb7ty/fw+QZblw67vDs8R0YHyQhgObx+yAJkBqmG5dPPDh1aPOGR/eugW0G4vlIoTIfyFcA+QekhhHJhPdQxbiAIguMBTQZrPD7108M6roWYDFQiIAAv6Aow/1bFwXgis+f2LUAynwoIaNcz8XNx3Dl7MEJUDGQpx9gtQ8YCueB+D26OECAAQDadt7e46D42QAAAABJRU5ErkJggg==) 2px 1px no-repeat;height:7px;width:8px}.dg li.save-row .button:hover{background-color:#bab19e;box-shadow:0 -1px 0 #b0a58f}.dg li.folder{border-bottom:0}.dg li.title{padding-left:16px;background:#000 url(data:image/gif;base64,R0lGODlhBQAFAJEAAP////Pz8////////yH5BAEAAAIALAAAAAAFAAUAAAIIlI+hKgFxoCgAOw==) 6px 10px no-repeat;cursor:pointer;border-bottom:1px solid rgba(255,255,255,0.2)}.dg .closed li.title{background-image:url(data:image/gif;base64,R0lGODlhBQAFAJEAAP////Pz8////////yH5BAEAAAIALAAAAAAFAAUAAAIIlGIWqMCbWAEAOw==)}.dg .cr.boolean{border-left:3px solid #806787}.dg .cr.function{border-left:3px solid #e61d5f}.dg .cr.number{border-left:3px solid #2fa1d6}.dg .cr.number input[type=text]{color:#2fa1d6}.dg .cr.string{border-left:3px solid #1ed36f}.dg .cr.string input[type=text]{color:#1ed36f}.dg .cr.function:hover,.dg .cr.boolean:hover{background:#111}.dg .c input[type=text]{background:#303030;outline:none}.dg .c input[type=text]:hover{background:#3c3c3c}.dg .c input[type=text]:focus{background:#494949;color:#fff}.dg .c .slider{background:#303030;cursor:ew-resize}.dg .c .slider-fg{background:#2fa1d6}.dg .c .slider:hover{background:#3c3c3c}.dg .c .slider:hover .slider-fg{background:#44abda}\n", dat.controllers.factory = function (OptionController, NumberControllerBox, NumberControllerSlider, StringController, FunctionController, BooleanController, common) {

  return function (object, property) {

    var initialValue = object[property];

    // Providing options?
    if (common.isArray(arguments[2]) || common.isObject(arguments[2])) {
      return new OptionController(object, property, arguments[2]);
    }

    // Providing a map?

    if (common.isNumber(initialValue)) {

      if (common.isNumber(arguments[2]) && common.isNumber(arguments[3])) {

        // Has min and max.
        return new NumberControllerSlider(object, property, arguments[2], arguments[3]);
      } else {

        return new NumberControllerBox(object, property, { min: arguments[2], max: arguments[3] });
      }
    }

    if (common.isString(initialValue)) {
      return new StringController(object, property);
    }

    if (common.isFunction(initialValue)) {
      return new FunctionController(object, property, '');
    }

    if (common.isBoolean(initialValue)) {
      return new BooleanController(object, property);
    }
  };
}(dat.controllers.OptionController, dat.controllers.NumberControllerBox, dat.controllers.NumberControllerSlider, dat.controllers.StringController = function (Controller, dom, common) {

  /**
   * @class Provides a text input to alter the string property of an object.
   *
   * @extends dat.controllers.Controller
   *
   * @param {Object} object The object to be manipulated
   * @param {string} property The name of the property to be manipulated
   *
   * @member dat.controllers
   */
  var StringController = function StringController(object, property) {

    StringController.superclass.call(this, object, property);

    var _this = this;

    this.__input = document.createElement('input');
    this.__input.setAttribute('type', 'text');

    dom.bind(this.__input, 'keyup', onChange);
    dom.bind(this.__input, 'change', onChange);
    dom.bind(this.__input, 'blur', onBlur);
    dom.bind(this.__input, 'keydown', function (e) {
      if (e.keyCode === 13) {
        this.blur();
      }
    });

    function onChange() {
      _this.setValue(_this.__input.value);
    }

    function onBlur() {
      if (_this.__onFinishChange) {
        _this.__onFinishChange.call(_this, _this.getValue());
      }
    }

    this.updateDisplay();

    this.domElement.appendChild(this.__input);
  };

  StringController.superclass = Controller;

  common.extend(StringController.prototype, Controller.prototype, {

    updateDisplay: function updateDisplay() {
      // Stops the caret from moving on account of:
      // keyup -> setValue -> updateDisplay
      if (!dom.isActive(this.__input)) {
        this.__input.value = this.getValue();
      }
      return StringController.superclass.prototype.updateDisplay.call(this);
    }

  });

  return StringController;
}(dat.controllers.Controller, dat.dom.dom, dat.utils.common), dat.controllers.FunctionController, dat.controllers.BooleanController, dat.utils.common), dat.controllers.Controller, dat.controllers.BooleanController, dat.controllers.FunctionController, dat.controllers.NumberControllerBox, dat.controllers.NumberControllerSlider, dat.controllers.OptionController, dat.controllers.ColorController = function (Controller, dom, Color, interpret, common) {

  var ColorController = function ColorController(object, property) {

    ColorController.superclass.call(this, object, property);

    this.__color = new Color(this.getValue());
    this.__temp = new Color(0);

    var _this = this;

    this.domElement = document.createElement('div');

    dom.makeSelectable(this.domElement, false);

    this.__selector = document.createElement('div');
    this.__selector.className = 'selector';

    this.__saturation_field = document.createElement('div');
    this.__saturation_field.className = 'saturation-field';

    this.__field_knob = document.createElement('div');
    this.__field_knob.className = 'field-knob';
    this.__field_knob_border = '2px solid ';

    this.__hue_knob = document.createElement('div');
    this.__hue_knob.className = 'hue-knob';

    this.__hue_field = document.createElement('div');
    this.__hue_field.className = 'hue-field';

    this.__input = document.createElement('input');
    this.__input.type = 'text';
    this.__input_textShadow = '0 1px 1px ';

    dom.bind(this.__input, 'keydown', function (e) {
      if (e.keyCode === 13) {
        // on enter
        onBlur.call(this);
      }
    });

    dom.bind(this.__input, 'blur', onBlur);

    dom.bind(this.__selector, 'mousedown', function (e) {

      dom.addClass(this, 'drag').bind(window, 'mouseup', function (e) {
        dom.removeClass(_this.__selector, 'drag');
      });
    });

    var value_field = document.createElement('div');

    common.extend(this.__selector.style, {
      width: '122px',
      height: '102px',
      padding: '3px',
      backgroundColor: '#222',
      boxShadow: '0px 1px 3px rgba(0,0,0,0.3)'
    });

    common.extend(this.__field_knob.style, {
      position: 'absolute',
      width: '12px',
      height: '12px',
      border: this.__field_knob_border + (this.__color.v < .5 ? '#fff' : '#000'),
      boxShadow: '0px 1px 3px rgba(0,0,0,0.5)',
      borderRadius: '12px',
      zIndex: 1
    });

    common.extend(this.__hue_knob.style, {
      position: 'absolute',
      width: '15px',
      height: '2px',
      borderRight: '4px solid #fff',
      zIndex: 1
    });

    common.extend(this.__saturation_field.style, {
      width: '100px',
      height: '100px',
      border: '1px solid #555',
      marginRight: '3px',
      display: 'inline-block',
      cursor: 'pointer'
    });

    common.extend(value_field.style, {
      width: '100%',
      height: '100%',
      background: 'none'
    });

    linearGradient(value_field, 'top', 'rgba(0,0,0,0)', '#000');

    common.extend(this.__hue_field.style, {
      width: '15px',
      height: '100px',
      display: 'inline-block',
      border: '1px solid #555',
      cursor: 'ns-resize'
    });

    hueGradient(this.__hue_field);

    common.extend(this.__input.style, {
      outline: 'none',
      //      width: '120px',
      textAlign: 'center',
      //      padding: '4px',
      //      marginBottom: '6px',
      color: '#fff',
      border: 0,
      fontWeight: 'bold',
      textShadow: this.__input_textShadow + 'rgba(0,0,0,0.7)'
    });

    dom.bind(this.__saturation_field, 'mousedown', fieldDown);
    dom.bind(this.__field_knob, 'mousedown', fieldDown);

    dom.bind(this.__hue_field, 'mousedown', function (e) {
      setH(e);
      dom.bind(window, 'mousemove', setH);
      dom.bind(window, 'mouseup', unbindH);
    });

    function fieldDown(e) {
      setSV(e);
      // document.body.style.cursor = 'none';
      dom.bind(window, 'mousemove', setSV);
      dom.bind(window, 'mouseup', unbindSV);
    }

    function unbindSV() {
      dom.unbind(window, 'mousemove', setSV);
      dom.unbind(window, 'mouseup', unbindSV);
      // document.body.style.cursor = 'default';
    }

    function onBlur() {
      var i = interpret(this.value);
      if (i !== false) {
        _this.__color.__state = i;
        _this.setValue(_this.__color.toOriginal());
      } else {
        this.value = _this.__color.toString();
      }
    }

    function unbindH() {
      dom.unbind(window, 'mousemove', setH);
      dom.unbind(window, 'mouseup', unbindH);
    }

    this.__saturation_field.appendChild(value_field);
    this.__selector.appendChild(this.__field_knob);
    this.__selector.appendChild(this.__saturation_field);
    this.__selector.appendChild(this.__hue_field);
    this.__hue_field.appendChild(this.__hue_knob);

    this.domElement.appendChild(this.__input);
    this.domElement.appendChild(this.__selector);

    this.updateDisplay();

    function setSV(e) {

      e.preventDefault();

      var w = dom.getWidth(_this.__saturation_field);
      var o = dom.getOffset(_this.__saturation_field);
      var s = (e.clientX - o.left + document.body.scrollLeft) / w;
      var v = 1 - (e.clientY - o.top + document.body.scrollTop) / w;

      if (v > 1) v = 1;else if (v < 0) v = 0;

      if (s > 1) s = 1;else if (s < 0) s = 0;

      _this.__color.v = v;
      _this.__color.s = s;

      _this.setValue(_this.__color.toOriginal());

      return false;
    }

    function setH(e) {

      e.preventDefault();

      var s = dom.getHeight(_this.__hue_field);
      var o = dom.getOffset(_this.__hue_field);
      var h = 1 - (e.clientY - o.top + document.body.scrollTop) / s;

      if (h > 1) h = 1;else if (h < 0) h = 0;

      _this.__color.h = h * 360;

      _this.setValue(_this.__color.toOriginal());

      return false;
    }
  };

  ColorController.superclass = Controller;

  common.extend(ColorController.prototype, Controller.prototype, {

    updateDisplay: function updateDisplay() {

      var i = interpret(this.getValue());

      if (i !== false) {

        var mismatch = false;

        // Check for mismatch on the interpreted value.

        common.each(Color.COMPONENTS, function (component) {
          if (!common.isUndefined(i[component]) && !common.isUndefined(this.__color.__state[component]) && i[component] !== this.__color.__state[component]) {
            mismatch = true;
            return {}; // break
          }
        }, this);

        // If nothing diverges, we keep our previous values
        // for statefulness, otherwise we recalculate fresh
        if (mismatch) {
          common.extend(this.__color.__state, i);
        }
      }

      common.extend(this.__temp.__state, this.__color.__state);

      this.__temp.a = 1;

      var flip = this.__color.v < .5 || this.__color.s > .5 ? 255 : 0;
      var _flip = 255 - flip;

      common.extend(this.__field_knob.style, {
        marginLeft: 100 * this.__color.s - 7 + 'px',
        marginTop: 100 * (1 - this.__color.v) - 7 + 'px',
        backgroundColor: this.__temp.toString(),
        border: this.__field_knob_border + 'rgb(' + flip + ',' + flip + ',' + flip + ')'
      });

      this.__hue_knob.style.marginTop = (1 - this.__color.h / 360) * 100 + 'px';

      this.__temp.s = 1;
      this.__temp.v = 1;

      linearGradient(this.__saturation_field, 'left', '#fff', this.__temp.toString());

      common.extend(this.__input.style, {
        backgroundColor: this.__input.value = this.__color.toString(),
        color: 'rgb(' + flip + ',' + flip + ',' + flip + ')',
        textShadow: this.__input_textShadow + 'rgba(' + _flip + ',' + _flip + ',' + _flip + ',.7)'
      });
    }

  });

  var vendors = ['-moz-', '-o-', '-webkit-', '-ms-', ''];

  function linearGradient(elem, x, a, b) {
    elem.style.background = '';
    common.each(vendors, function (vendor) {
      elem.style.cssText += 'background: ' + vendor + 'linear-gradient(' + x + ', ' + a + ' 0%, ' + b + ' 100%); ';
    });
  }

  function hueGradient(elem) {
    elem.style.background = '';
    elem.style.cssText += 'background: -moz-linear-gradient(top,  #ff0000 0%, #ff00ff 17%, #0000ff 34%, #00ffff 50%, #00ff00 67%, #ffff00 84%, #ff0000 100%);';
    elem.style.cssText += 'background: -webkit-linear-gradient(top,  #ff0000 0%,#ff00ff 17%,#0000ff 34%,#00ffff 50%,#00ff00 67%,#ffff00 84%,#ff0000 100%);';
    elem.style.cssText += 'background: -o-linear-gradient(top,  #ff0000 0%,#ff00ff 17%,#0000ff 34%,#00ffff 50%,#00ff00 67%,#ffff00 84%,#ff0000 100%);';
    elem.style.cssText += 'background: -ms-linear-gradient(top,  #ff0000 0%,#ff00ff 17%,#0000ff 34%,#00ffff 50%,#00ff00 67%,#ffff00 84%,#ff0000 100%);';
    elem.style.cssText += 'background: linear-gradient(top,  #ff0000 0%,#ff00ff 17%,#0000ff 34%,#00ffff 50%,#00ff00 67%,#ffff00 84%,#ff0000 100%);';
  }

  return ColorController;
}(dat.controllers.Controller, dat.dom.dom, dat.color.Color = function (interpret, math, _toString, common) {

  var Color = function Color() {

    this.__state = interpret.apply(this, arguments);

    if (this.__state === false) {
      throw 'Failed to interpret color arguments';
    }

    this.__state.a = this.__state.a || 1;
  };

  Color.COMPONENTS = ['r', 'g', 'b', 'h', 's', 'v', 'hex', 'a'];

  common.extend(Color.prototype, {

    toString: function toString() {
      return _toString(this);
    },

    toOriginal: function toOriginal() {
      return this.__state.conversion.write(this);
    }

  });

  defineRGBComponent(Color.prototype, 'r', 2);
  defineRGBComponent(Color.prototype, 'g', 1);
  defineRGBComponent(Color.prototype, 'b', 0);

  defineHSVComponent(Color.prototype, 'h');
  defineHSVComponent(Color.prototype, 's');
  defineHSVComponent(Color.prototype, 'v');

  Object.defineProperty(Color.prototype, 'a', {

    get: function get() {
      return this.__state.a;
    },

    set: function set(v) {
      this.__state.a = v;
    }

  });

  Object.defineProperty(Color.prototype, 'hex', {

    get: function get() {

      if (!this.__state.space !== 'HEX') {
        this.__state.hex = math.rgb_to_hex(this.r, this.g, this.b);
      }

      return this.__state.hex;
    },

    set: function set(v) {

      this.__state.space = 'HEX';
      this.__state.hex = v;
    }

  });

  function defineRGBComponent(target, component, componentHexIndex) {

    Object.defineProperty(target, component, {

      get: function get() {

        if (this.__state.space === 'RGB') {
          return this.__state[component];
        }

        recalculateRGB(this, component, componentHexIndex);

        return this.__state[component];
      },

      set: function set(v) {

        if (this.__state.space !== 'RGB') {
          recalculateRGB(this, component, componentHexIndex);
          this.__state.space = 'RGB';
        }

        this.__state[component] = v;
      }

    });
  }

  function defineHSVComponent(target, component) {

    Object.defineProperty(target, component, {

      get: function get() {

        if (this.__state.space === 'HSV') return this.__state[component];

        recalculateHSV(this);

        return this.__state[component];
      },

      set: function set(v) {

        if (this.__state.space !== 'HSV') {
          recalculateHSV(this);
          this.__state.space = 'HSV';
        }

        this.__state[component] = v;
      }

    });
  }

  function recalculateRGB(color, component, componentHexIndex) {

    if (color.__state.space === 'HEX') {

      color.__state[component] = math.component_from_hex(color.__state.hex, componentHexIndex);
    } else if (color.__state.space === 'HSV') {

      common.extend(color.__state, math.hsv_to_rgb(color.__state.h, color.__state.s, color.__state.v));
    } else {

      throw 'Corrupted color state';
    }
  }

  function recalculateHSV(color) {

    var result = math.rgb_to_hsv(color.r, color.g, color.b);

    common.extend(color.__state, {
      s: result.s,
      v: result.v
    });

    if (!common.isNaN(result.h)) {
      color.__state.h = result.h;
    } else if (common.isUndefined(color.__state.h)) {
      color.__state.h = 0;
    }
  }

  return Color;
}(dat.color.interpret, dat.color.math = function () {

  var tmpComponent;

  return {

    hsv_to_rgb: function hsv_to_rgb(h, s, v) {

      var hi = Math.floor(h / 60) % 6;

      var f = h / 60 - Math.floor(h / 60);
      var p = v * (1.0 - s);
      var q = v * (1.0 - f * s);
      var t = v * (1.0 - (1.0 - f) * s);
      var c = [[v, t, p], [q, v, p], [p, v, t], [p, q, v], [t, p, v], [v, p, q]][hi];

      return {
        r: c[0] * 255,
        g: c[1] * 255,
        b: c[2] * 255
      };
    },

    rgb_to_hsv: function rgb_to_hsv(r, g, b) {

      var min = Math.min(r, g, b),
          max = Math.max(r, g, b),
          delta = max - min,
          h,
          s;

      if (max != 0) {
        s = delta / max;
      } else {
        return {
          h: NaN,
          s: 0,
          v: 0
        };
      }

      if (r == max) {
        h = (g - b) / delta;
      } else if (g == max) {
        h = 2 + (b - r) / delta;
      } else {
        h = 4 + (r - g) / delta;
      }
      h /= 6;
      if (h < 0) {
        h += 1;
      }

      return {
        h: h * 360,
        s: s,
        v: max / 255
      };
    },

    rgb_to_hex: function rgb_to_hex(r, g, b) {
      var hex = this.hex_with_component(0, 2, r);
      hex = this.hex_with_component(hex, 1, g);
      hex = this.hex_with_component(hex, 0, b);
      return hex;
    },

    component_from_hex: function component_from_hex(hex, componentIndex) {
      return hex >> componentIndex * 8 & 0xFF;
    },

    hex_with_component: function hex_with_component(hex, componentIndex, value) {
      return value << (tmpComponent = componentIndex * 8) | hex & ~(0xFF << tmpComponent);
    }

  };
}(), dat.color.toString, dat.utils.common), dat.color.interpret, dat.utils.common), dat.utils.requestAnimationFrame = function () {

  /**
   * requirejs version of Paul Irish's RequestAnimationFrame
   * http://paulirish.com/2011/requestanimationframe-for-smart-animating/
   */

  return window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame || function (callback, element) {

    window.setTimeout(callback, 1000 / 60);
  };
}(), dat.dom.CenteredDiv = function (dom, common) {

  var CenteredDiv = function CenteredDiv() {

    this.backgroundElement = document.createElement('div');
    common.extend(this.backgroundElement.style, {
      backgroundColor: 'rgba(0,0,0,0.8)',
      top: 0,
      left: 0,
      display: 'none',
      zIndex: '1000',
      opacity: 0,
      WebkitTransition: 'opacity 0.2s linear'
    });

    dom.makeFullscreen(this.backgroundElement);
    this.backgroundElement.style.position = 'fixed';

    this.domElement = document.createElement('div');
    common.extend(this.domElement.style, {
      position: 'fixed',
      display: 'none',
      zIndex: '1001',
      opacity: 0,
      WebkitTransition: '-webkit-transform 0.2s ease-out, opacity 0.2s linear'
    });

    document.body.appendChild(this.backgroundElement);
    document.body.appendChild(this.domElement);

    var _this = this;
    dom.bind(this.backgroundElement, 'click', function () {
      _this.hide();
    });
  };

  CenteredDiv.prototype.show = function () {

    var _this = this;

    this.backgroundElement.style.display = 'block';

    this.domElement.style.display = 'block';
    this.domElement.style.opacity = 0;
    //    this.domElement.style.top = '52%';
    this.domElement.style.webkitTransform = 'scale(1.1)';

    this.layout();

    common.defer(function () {
      _this.backgroundElement.style.opacity = 1;
      _this.domElement.style.opacity = 1;
      _this.domElement.style.webkitTransform = 'scale(1)';
    });
  };

  CenteredDiv.prototype.hide = function () {

    var _this = this;

    var hide = function hide() {

      _this.domElement.style.display = 'none';
      _this.backgroundElement.style.display = 'none';

      dom.unbind(_this.domElement, 'webkitTransitionEnd', hide);
      dom.unbind(_this.domElement, 'transitionend', hide);
      dom.unbind(_this.domElement, 'oTransitionEnd', hide);
    };

    dom.bind(this.domElement, 'webkitTransitionEnd', hide);
    dom.bind(this.domElement, 'transitionend', hide);
    dom.bind(this.domElement, 'oTransitionEnd', hide);

    this.backgroundElement.style.opacity = 0;
    //    this.domElement.style.top = '48%';
    this.domElement.style.opacity = 0;
    this.domElement.style.webkitTransform = 'scale(1.1)';
  };

  CenteredDiv.prototype.layout = function () {
    this.domElement.style.left = window.innerWidth / 2 - dom.getWidth(this.domElement) / 2 + 'px';
    this.domElement.style.top = window.innerHeight / 2 - dom.getHeight(this.domElement) / 2 + 'px';
  };

  function lockScroll(e) {
    console.log(e);
  }

  return CenteredDiv;
}(dat.dom.dom, dat.utils.common), dat.dom.dom, dat.utils.common);

/***/ }),

/***/ 39:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/**
 * dat-gui JavaScript Controller Library
 * http://code.google.com/p/dat-gui
 *
 * Copyright 2011 Data Arts Team, Google Creative Lab
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 */

/** @namespace */
var dat = module.exports = dat || {};

/** @namespace */
dat.color = dat.color || {};

/** @namespace */
dat.utils = dat.utils || {};

dat.utils.common = function () {

  var ARR_EACH = Array.prototype.forEach;
  var ARR_SLICE = Array.prototype.slice;

  /**
   * Band-aid methods for things that should be a lot easier in JavaScript.
   * Implementation and structure inspired by underscore.js
   * http://documentcloud.github.com/underscore/
   */

  return {

    BREAK: {},

    extend: function extend(target) {

      this.each(ARR_SLICE.call(arguments, 1), function (obj) {

        for (var key in obj) {
          if (!this.isUndefined(obj[key])) target[key] = obj[key];
        }
      }, this);

      return target;
    },

    defaults: function defaults(target) {

      this.each(ARR_SLICE.call(arguments, 1), function (obj) {

        for (var key in obj) {
          if (this.isUndefined(target[key])) target[key] = obj[key];
        }
      }, this);

      return target;
    },

    compose: function compose() {
      var toCall = ARR_SLICE.call(arguments);
      return function () {
        var args = ARR_SLICE.call(arguments);
        for (var i = toCall.length - 1; i >= 0; i--) {
          args = [toCall[i].apply(this, args)];
        }
        return args[0];
      };
    },

    each: function each(obj, itr, scope) {

      if (ARR_EACH && obj.forEach === ARR_EACH) {

        obj.forEach(itr, scope);
      } else if (obj.length === obj.length + 0) {
        // Is number but not NaN

        for (var key = 0, l = obj.length; key < l; key++) {
          if (key in obj && itr.call(scope, obj[key], key) === this.BREAK) return;
        }
      } else {

        for (var key in obj) {
          if (itr.call(scope, obj[key], key) === this.BREAK) return;
        }
      }
    },

    defer: function defer(fnc) {
      setTimeout(fnc, 0);
    },

    toArray: function toArray(obj) {
      if (obj.toArray) return obj.toArray();
      return ARR_SLICE.call(obj);
    },

    isUndefined: function isUndefined(obj) {
      return obj === undefined;
    },

    isNull: function isNull(obj) {
      return obj === null;
    },

    isNaN: function isNaN(obj) {
      return obj !== obj;
    },

    isArray: Array.isArray || function (obj) {
      return obj.constructor === Array;
    },

    isObject: function isObject(obj) {
      return obj === Object(obj);
    },

    isNumber: function isNumber(obj) {
      return obj === obj + 0;
    },

    isString: function isString(obj) {
      return obj === obj + '';
    },

    isBoolean: function isBoolean(obj) {
      return obj === false || obj === true;
    },

    isFunction: function isFunction(obj) {
      return Object.prototype.toString.call(obj) === '[object Function]';
    }

  };
}();

dat.color.toString = function (common) {

  return function (color) {

    if (color.a == 1 || common.isUndefined(color.a)) {

      var s = color.hex.toString(16);
      while (s.length < 6) {
        s = '0' + s;
      }

      return '#' + s;
    } else {

      return 'rgba(' + Math.round(color.r) + ',' + Math.round(color.g) + ',' + Math.round(color.b) + ',' + color.a + ')';
    }
  };
}(dat.utils.common);

dat.Color = dat.color.Color = function (interpret, math, _toString, common) {

  var Color = function Color() {

    this.__state = interpret.apply(this, arguments);

    if (this.__state === false) {
      throw 'Failed to interpret color arguments';
    }

    this.__state.a = this.__state.a || 1;
  };

  Color.COMPONENTS = ['r', 'g', 'b', 'h', 's', 'v', 'hex', 'a'];

  common.extend(Color.prototype, {

    toString: function toString() {
      return _toString(this);
    },

    toOriginal: function toOriginal() {
      return this.__state.conversion.write(this);
    }

  });

  defineRGBComponent(Color.prototype, 'r', 2);
  defineRGBComponent(Color.prototype, 'g', 1);
  defineRGBComponent(Color.prototype, 'b', 0);

  defineHSVComponent(Color.prototype, 'h');
  defineHSVComponent(Color.prototype, 's');
  defineHSVComponent(Color.prototype, 'v');

  Object.defineProperty(Color.prototype, 'a', {

    get: function get() {
      return this.__state.a;
    },

    set: function set(v) {
      this.__state.a = v;
    }

  });

  Object.defineProperty(Color.prototype, 'hex', {

    get: function get() {

      if (!this.__state.space !== 'HEX') {
        this.__state.hex = math.rgb_to_hex(this.r, this.g, this.b);
      }

      return this.__state.hex;
    },

    set: function set(v) {

      this.__state.space = 'HEX';
      this.__state.hex = v;
    }

  });

  function defineRGBComponent(target, component, componentHexIndex) {

    Object.defineProperty(target, component, {

      get: function get() {

        if (this.__state.space === 'RGB') {
          return this.__state[component];
        }

        recalculateRGB(this, component, componentHexIndex);

        return this.__state[component];
      },

      set: function set(v) {

        if (this.__state.space !== 'RGB') {
          recalculateRGB(this, component, componentHexIndex);
          this.__state.space = 'RGB';
        }

        this.__state[component] = v;
      }

    });
  }

  function defineHSVComponent(target, component) {

    Object.defineProperty(target, component, {

      get: function get() {

        if (this.__state.space === 'HSV') return this.__state[component];

        recalculateHSV(this);

        return this.__state[component];
      },

      set: function set(v) {

        if (this.__state.space !== 'HSV') {
          recalculateHSV(this);
          this.__state.space = 'HSV';
        }

        this.__state[component] = v;
      }

    });
  }

  function recalculateRGB(color, component, componentHexIndex) {

    if (color.__state.space === 'HEX') {

      color.__state[component] = math.component_from_hex(color.__state.hex, componentHexIndex);
    } else if (color.__state.space === 'HSV') {

      common.extend(color.__state, math.hsv_to_rgb(color.__state.h, color.__state.s, color.__state.v));
    } else {

      throw 'Corrupted color state';
    }
  }

  function recalculateHSV(color) {

    var result = math.rgb_to_hsv(color.r, color.g, color.b);

    common.extend(color.__state, {
      s: result.s,
      v: result.v
    });

    if (!common.isNaN(result.h)) {
      color.__state.h = result.h;
    } else if (common.isUndefined(color.__state.h)) {
      color.__state.h = 0;
    }
  }

  return Color;
}(dat.color.interpret = function (toString, common) {

  var result, toReturn;

  var interpret = function interpret() {

    toReturn = false;

    var original = arguments.length > 1 ? common.toArray(arguments) : arguments[0];

    common.each(INTERPRETATIONS, function (family) {

      if (family.litmus(original)) {

        common.each(family.conversions, function (conversion, conversionName) {

          result = conversion.read(original);

          if (toReturn === false && result !== false) {
            toReturn = result;
            result.conversionName = conversionName;
            result.conversion = conversion;
            return common.BREAK;
          }
        });

        return common.BREAK;
      }
    });

    return toReturn;
  };

  var INTERPRETATIONS = [

  // Strings
  {

    litmus: common.isString,

    conversions: {

      THREE_CHAR_HEX: {

        read: function read(original) {

          var test = original.match(/^#([A-F0-9])([A-F0-9])([A-F0-9])$/i);
          if (test === null) return false;

          return {
            space: 'HEX',
            hex: parseInt('0x' + test[1].toString() + test[1].toString() + test[2].toString() + test[2].toString() + test[3].toString() + test[3].toString())
          };
        },

        write: toString

      },

      SIX_CHAR_HEX: {

        read: function read(original) {

          var test = original.match(/^#([A-F0-9]{6})$/i);
          if (test === null) return false;

          return {
            space: 'HEX',
            hex: parseInt('0x' + test[1].toString())
          };
        },

        write: toString

      },

      CSS_RGB: {

        read: function read(original) {

          var test = original.match(/^rgb\(\s*(.+)\s*,\s*(.+)\s*,\s*(.+)\s*\)/);
          if (test === null) return false;

          return {
            space: 'RGB',
            r: parseFloat(test[1]),
            g: parseFloat(test[2]),
            b: parseFloat(test[3])
          };
        },

        write: toString

      },

      CSS_RGBA: {

        read: function read(original) {

          var test = original.match(/^rgba\(\s*(.+)\s*,\s*(.+)\s*,\s*(.+)\s*\,\s*(.+)\s*\)/);
          if (test === null) return false;

          return {
            space: 'RGB',
            r: parseFloat(test[1]),
            g: parseFloat(test[2]),
            b: parseFloat(test[3]),
            a: parseFloat(test[4])
          };
        },

        write: toString

      }

    }

  },

  // Numbers
  {

    litmus: common.isNumber,

    conversions: {

      HEX: {
        read: function read(original) {
          return {
            space: 'HEX',
            hex: original,
            conversionName: 'HEX'
          };
        },

        write: function write(color) {
          return color.hex;
        }
      }

    }

  },

  // Arrays
  {

    litmus: common.isArray,

    conversions: {

      RGB_ARRAY: {
        read: function read(original) {
          if (original.length != 3) return false;
          return {
            space: 'RGB',
            r: original[0],
            g: original[1],
            b: original[2]
          };
        },

        write: function write(color) {
          return [color.r, color.g, color.b];
        }

      },

      RGBA_ARRAY: {
        read: function read(original) {
          if (original.length != 4) return false;
          return {
            space: 'RGB',
            r: original[0],
            g: original[1],
            b: original[2],
            a: original[3]
          };
        },

        write: function write(color) {
          return [color.r, color.g, color.b, color.a];
        }

      }

    }

  },

  // Objects
  {

    litmus: common.isObject,

    conversions: {

      RGBA_OBJ: {
        read: function read(original) {
          if (common.isNumber(original.r) && common.isNumber(original.g) && common.isNumber(original.b) && common.isNumber(original.a)) {
            return {
              space: 'RGB',
              r: original.r,
              g: original.g,
              b: original.b,
              a: original.a
            };
          }
          return false;
        },

        write: function write(color) {
          return {
            r: color.r,
            g: color.g,
            b: color.b,
            a: color.a
          };
        }
      },

      RGB_OBJ: {
        read: function read(original) {
          if (common.isNumber(original.r) && common.isNumber(original.g) && common.isNumber(original.b)) {
            return {
              space: 'RGB',
              r: original.r,
              g: original.g,
              b: original.b
            };
          }
          return false;
        },

        write: function write(color) {
          return {
            r: color.r,
            g: color.g,
            b: color.b
          };
        }
      },

      HSVA_OBJ: {
        read: function read(original) {
          if (common.isNumber(original.h) && common.isNumber(original.s) && common.isNumber(original.v) && common.isNumber(original.a)) {
            return {
              space: 'HSV',
              h: original.h,
              s: original.s,
              v: original.v,
              a: original.a
            };
          }
          return false;
        },

        write: function write(color) {
          return {
            h: color.h,
            s: color.s,
            v: color.v,
            a: color.a
          };
        }
      },

      HSV_OBJ: {
        read: function read(original) {
          if (common.isNumber(original.h) && common.isNumber(original.s) && common.isNumber(original.v)) {
            return {
              space: 'HSV',
              h: original.h,
              s: original.s,
              v: original.v
            };
          }
          return false;
        },

        write: function write(color) {
          return {
            h: color.h,
            s: color.s,
            v: color.v
          };
        }

      }

    }

  }];

  return interpret;
}(dat.color.toString, dat.utils.common), dat.color.math = function () {

  var tmpComponent;

  return {

    hsv_to_rgb: function hsv_to_rgb(h, s, v) {

      var hi = Math.floor(h / 60) % 6;

      var f = h / 60 - Math.floor(h / 60);
      var p = v * (1.0 - s);
      var q = v * (1.0 - f * s);
      var t = v * (1.0 - (1.0 - f) * s);
      var c = [[v, t, p], [q, v, p], [p, v, t], [p, q, v], [t, p, v], [v, p, q]][hi];

      return {
        r: c[0] * 255,
        g: c[1] * 255,
        b: c[2] * 255
      };
    },

    rgb_to_hsv: function rgb_to_hsv(r, g, b) {

      var min = Math.min(r, g, b),
          max = Math.max(r, g, b),
          delta = max - min,
          h,
          s;

      if (max != 0) {
        s = delta / max;
      } else {
        return {
          h: NaN,
          s: 0,
          v: 0
        };
      }

      if (r == max) {
        h = (g - b) / delta;
      } else if (g == max) {
        h = 2 + (b - r) / delta;
      } else {
        h = 4 + (r - g) / delta;
      }
      h /= 6;
      if (h < 0) {
        h += 1;
      }

      return {
        h: h * 360,
        s: s,
        v: max / 255
      };
    },

    rgb_to_hex: function rgb_to_hex(r, g, b) {
      var hex = this.hex_with_component(0, 2, r);
      hex = this.hex_with_component(hex, 1, g);
      hex = this.hex_with_component(hex, 0, b);
      return hex;
    },

    component_from_hex: function component_from_hex(hex, componentIndex) {
      return hex >> componentIndex * 8 & 0xFF;
    },

    hex_with_component: function hex_with_component(hex, componentIndex, value) {
      return value << (tmpComponent = componentIndex * 8) | hex & ~(0xFF << tmpComponent);
    }

  };
}(), dat.color.toString, dat.utils.common);

/***/ }),

/***/ 40:
/***/ (function(module, exports, __webpack_require__) {

"use strict";
var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_RESULT__;

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

// stats.js - http://github.com/mrdoob/stats.js
(function (f, e) {
  "object" === ( false ? "undefined" : _typeof(exports)) && "undefined" !== typeof module ? module.exports = e() :  true ? !(__WEBPACK_AMD_DEFINE_FACTORY__ = (e),
				__WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ?
				(__WEBPACK_AMD_DEFINE_FACTORY__.call(exports, __webpack_require__, exports, module)) :
				__WEBPACK_AMD_DEFINE_FACTORY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__)) : f.Stats = e();
})(undefined, function () {
  var f = function f() {
    function e(a) {
      c.appendChild(a.dom);return a;
    }function u(a) {
      for (var d = 0; d < c.children.length; d++) {
        c.children[d].style.display = d === a ? "block" : "none";
      }l = a;
    }var l = 0,
        c = document.createElement("div");c.style.cssText = "position:fixed;top:0;left:0;cursor:pointer;opacity:0.9;z-index:10000";c.addEventListener("click", function (a) {
      a.preventDefault();
      u(++l % c.children.length);
    }, !1);var k = (performance || Date).now(),
        g = k,
        a = 0,
        r = e(new f.Panel("FPS", "#0ff", "#002")),
        h = e(new f.Panel("MS", "#0f0", "#020"));if (self.performance && self.performance.memory) var t = e(new f.Panel("MB", "#f08", "#201"));u(0);return { REVISION: 16, dom: c, addPanel: e, showPanel: u, begin: function begin() {
        k = (performance || Date).now();
      }, end: function end() {
        a++;var c = (performance || Date).now();h.update(c - k, 200);if (c > g + 1E3 && (r.update(1E3 * a / (c - g), 100), g = c, a = 0, t)) {
          var d = performance.memory;t.update(d.usedJSHeapSize / 1048576, d.jsHeapSizeLimit / 1048576);
        }return c;
      }, update: function update() {
        k = this.end();
      }, domElement: c, setMode: u };
  };f.Panel = function (e, f, l) {
    var c = Infinity,
        k = 0,
        g = Math.round,
        a = g(window.devicePixelRatio || 1),
        r = 80 * a,
        h = 48 * a,
        t = 3 * a,
        v = 2 * a,
        d = 3 * a,
        m = 15 * a,
        n = 74 * a,
        p = 30 * a,
        q = document.createElement("canvas");q.width = r;q.height = h;q.style.cssText = "width:80px;height:48px";var b = q.getContext("2d");b.font = "bold " + 9 * a + "px Helvetica,Arial,sans-serif";b.textBaseline = "top";b.fillStyle = l;b.fillRect(0, 0, r, h);b.fillStyle = f;b.fillText(e, t, v);
    b.fillRect(d, m, n, p);b.fillStyle = l;b.globalAlpha = .9;b.fillRect(d, m, n, p);return { dom: q, update: function update(h, w) {
        c = Math.min(c, h);k = Math.max(k, h);b.fillStyle = l;b.globalAlpha = 1;b.fillRect(0, 0, r, m);b.fillStyle = f;b.fillText(g(h) + " " + e + " (" + g(c) + "-" + g(k) + ")", t, v);b.drawImage(q, d + a, m, n - a, p, d, m, n - a, p);b.fillRect(d + n - a, m, a, p);b.fillStyle = l;b.globalAlpha = .9;b.fillRect(d + n - a, m, a, g((1 - h / w) * p));
      } };
  };return f;
});

/***/ })

/******/ });