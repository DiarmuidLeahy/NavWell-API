'use strict';

var Q = require('q');
var app;

/**
 * private funtion to know if object is empty
 * @param  {Object}  pObject object to evaluate	
 * @return {Boolean}         true is Empty, false is not
 */
var isEmptyObject = function(pObject) {
	for(var key in pObject) {
		if (pObject.hasOwnProperty(key)) {
			return false;
		}
	}
	return true;
};

/*
 * function to verify if user are authenticated
 * @param  {Object} pRequest  Request object
 * @param  {Object} pResponse Response object
 * @param  {Object} pNext
 */
exports.auth = function(pRequest, pResponse, pNext){ 
	//console.log('FUNCTION VERIFY AUTH');
	if (!pRequest.isAuthenticated()){
		pResponse.send(401); 
	} else {
		pNext();
	}
};