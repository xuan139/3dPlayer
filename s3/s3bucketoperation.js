var bucketName = 'www.uiuchome.com';
var bucket = new AWS.S3({
    params: {
        Bucket: bucketName,
        apiVersion: "2006-03-01",
        region: 'us-east-2',
        maxRetries: 15
    }
});


function ViewDirinS3(bucketname){
    return new Promise(function (myResolve, myReject) {
//    var prefix = bucketprefixname;
    // var params = { 
    //     Bucket: bucket,
    //     Delimiter: '/',
    //     Prefix: bucketprefixname 
    // }
    var prefix = bucketname;
    bucket.listObjects(
        {
            // Bucket: bucket,
            Prefix: prefix ,
            Delimiter: '/'
        },
    
    // Bucket=bucket, Prefix=prefix, Delimiter='/'
    function(err, data)
    {
        var result='';
        if (err){
            myReject('Error');
        } 
        else{
            // alert("view s3");
            console.log(data.Contents);
            var objKeys = "";
            data.Contents.forEach(function(obj) {
                var fileName = obj.Key;
                var fileURL = bucketName + "/" +obj.Key;
                result = result  
                + '<div>' + fileName 
                +' <embed src= "'+ fileURL + '" width="100%" height="100%" >' + '<p>' +'<br>' 
                + '</div>'
            });
                
        }
        console.log('html = ' + result);
        myResolve(result);
    })
    });

}
