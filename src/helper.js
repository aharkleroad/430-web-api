const iterateThroughJSON = (jsonObj, objKey, objValue) => {
    let returnArray = [];
    for (i = 0; i < jsonObj.length; i++){
        if (jsonObj[i][objKey]) {
            if (jsonObj[i][objKey] == objValue){
                returnArray.push(jsonObj[i]);
            }
        }
    }

    return returnArray;
}

module.exports = {
    iterateThroughJSON,
}