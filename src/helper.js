const iterateThroughJSON = (jsonObj, objKey, objValue) => {
    let returnArray = [];
    for (let i = 0; i < jsonObj.length; i++){
        if (jsonObj[i][objKey]) {
            let objString = JSON.stringify(jsonObj[i][objKey]);
            let valueString = JSON.stringify(objValue);
            if (objString.toLowerCase() === valueString.toLowerCase()){
                returnArray.push(jsonObj[i]);
            }
        }
    }

    return returnArray;
}

const findNumericRangeJSON = (jsonObj, objKey, smallerValue, greaterValue) => {
    let returnArray = [];
    for (let i = 0; i < jsonObj.length; i++){
        if (jsonObj[i][objKey]) {
            if (jsonObj[i][objKey] <= greaterValue && jsonObj[i][objKey] >= smallerValue){
                returnArray.push(jsonObj[i]);
            }
        }
    }

    return returnArray;
}

const iterateThroughNestedJSON = (jsonObj, objKey, objValue) => {
    let returnArray = [];
    for (let i = 0; i < jsonObj.length; i++){
        if (jsonObj[i][objKey]) {
            let valueString = JSON.stringify(objValue);
            for (let j = 0; j < jsonObj[i][objKey].length; j++){
                let objString = JSON.stringify(jsonObj[i][objKey][j]);
                if (objString.toLowerCase() === valueString.toLowerCase()){
                    returnArray.push(jsonObj[i]);
                }
            }
        }
    }

    return returnArray;
}

const updateJSON = (jsonObj, objKey, objValue, newObj) => {
    for (let i = 0; i < jsonObj.length; i++){
        if (jsonObj[i][objKey]) {
            let objString = JSON.stringify(jsonObj[i][objKey]);
            let valueString = JSON.stringify(objValue);
            if (objString.toLowerCase() === valueString.toLowerCase()){
                jsonObj[i] = newObj;
                return true;
            }
        }
    }
}

module.exports = {
    iterateThroughJSON,
    findNumericRangeJSON,
    iterateThroughNestedJSON,
    updateJSON
}