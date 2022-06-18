import csv from "csvtojson";

export default function csv2JSON(file) {
    return new Promise((res, rej) => {
        if (file) {
            var reader = new FileReader();
            reader.onload = function (e) {
                csv().fromString(e.target.result).then(res);
            };
            reader.readAsText(file);
        } else {
            rej("Failed to load file");
        }
    });

    /*  var lines = csv.split("\n");

    var result = [];

    var headers = lines[0].split(",");

    for (var i = 1; i < lines.length; i++) {
        var obj = {};
        var currentline = lines[i].split(",");

        for (var j = 0; j < headers.length; j++) {
            obj[headers[j]] = currentline[j];
        }

        result.push(obj);
    }

    //return result; //JavaScript object
    return JSON.stringify(result); //JSON */
}
