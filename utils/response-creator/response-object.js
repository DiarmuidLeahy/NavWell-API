function ResponseCreator(pResponseObject, pResponseCode) {
	this.responseCode = pResponseCode;
	this.responseObject = pResponseObject;
}

module.exports = ResponseCreator;