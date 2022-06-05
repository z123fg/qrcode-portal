export default function csv2JSON(file) {
    return new Promise((res, rej) => {
        if (file) {
            var r = new FileReader();
            r.onload = function (e) {
                var csv = e.target.result;
                const lines = csv.split('\r\n')
                const result = []
                const headers = lines[0].split(',');
            
                for (let i = 1; i < lines.length; i++) {        
                    if (!lines[i])
                        continue
                    const obj = {}
                    const currentline = lines[i].split(',')
            
                    for (let j = 0; j < headers.length; j++) {
                        obj[headers[j]] = currentline[j]
                    }
                    result.push(obj)
                }
                //return result; //JavaScript object
                res(result) ;
            };
            r.readAsText(file);
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
