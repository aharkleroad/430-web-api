const iterateThroughJSON = (jsonObj, objKey, objValue) => {
    let returnArray = [];
    for (let i = 0; i < jsonObj.length; i++){
        if (jsonObj[i][objKey]) {
            if (jsonObj[i][objKey] == objValue){
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
            for (let j = 0; j < jsonObj[i][objKey].length; j++){
                if (jsonObj[i][objKey][j] == objValue){
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
            if (jsonObj[i][objKey] == objValue){
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