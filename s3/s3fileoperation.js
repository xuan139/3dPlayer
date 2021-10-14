
var bucketName = 'www.uiuchome.com';
var bucket = new AWS.S3({
    params: {
        Bucket: bucketName,
        apiVersion: "2006-03-01",
        region: 'us-east-2',
        maxRetries: 15
    }
});


var docClient = new AWS.DynamoDB.DocumentClient();
// Viewall content
function showContent(table_name) {
    return new Promise(function (myResolve, myReject) {
    var errstatus = false;
    var params = { TableName: table_name,}
    docClient.scan(params, onScan);
    var idx = 0;
    function onScan(err, data) {
        var imgurl = "";
            if (err) {
                var errstatus = true;
                myReject('Read Data Error');
               
            } else {
                data.Items.forEach(function(item) {
                var newPreSignedUrl = 'preSignedURL';
                var tStamp =  item['uploadTime'] ;
                var fileURL =  item['URL'] ;
                var fileName = item['ID'];
                var author = item['uploadUser']

                    if (fileName != 'videofile/')
                    {
                        imgurl = imgurl
                        + '<div>' +'<embed src= '+ fileURL + ' width="640px" height="480px" >' + '<p>' +  'Author:' + author + '<p>' + 'UploadTime: ' + tStamp +'<p>' +  'FileName: ' + fileName  +'<br>' 
                        + '<button type="button"  class="button-class btn-left-bar" id ="' + fileName + '"  onclick = "addfavorfunction(' + "'" +    fileURL  + "'," + "'" +fileName + "'" + ')">Good</button>'
                        + '<button type="button"  class="button-class btn-signup" id ="' + fileName + '"  onclick = "addfavorfunction(' + "'" +    fileURL  + "'," + "'" +fileName + "'" +  ')">Noop</button>'
                        + '<button type="button"  class="button-class btn-signin" id ="' + fileName + '"  onclick = "addtoMyList(' + "'" +    fileURL  + "'," + "'" +fileName + "'" +  ')">Like</button>'
                        + '<button type="button"  class="button-class btn-profile" id ="' + fileName + '"  onclick = "delVideo(' + "'" +    fileURL  + "'," + "'" +fileName + "'" +  ')">Delete</button>'
                        + '<button type="button"  class="button-class btn-profile" id ="' + fileName + '"  onclick = "downloadVideo(' + "'" +    fileURL  + "'," + "'" +fileName + "'" +  ')">Download</button>'
                        + '</div>'     
                        ;
                    }

                });
                myResolve(imgurl);
            }

        }
    }
)}
// UploadFiletoBucketPromise(bucketName,file)



function UploadFiletoBucketPromise(bucketName,file)
{
    return new Promise(function (myResolve, myReject) {
        if (file) {
            var tempFile =  file.name.replace(/\s/g, "_");
            filename = bucketName + '/' +tempFile;
            var params = {
                Key: filename,
                ContentType: file.type,
                Body: file,
                ACL: 'public-read'
            };
            console.log(tempFile);
            bucket.putObject(params, function(err, data) {
                if (err) {
                    myReject(err);
                } else {
                    console.log('success of uploading ' + tempFile);
                    myResolve('success ' + tempFile);
                }
            });
        }
    })
}

function UploadtoS3(filelocation){
    return new Promise(function (myResolve, myReject) {
    var uploadresults = "";
    var filelist = "";
    var errstatus = false;
    var idx=0;
    
    uploadresults = "total upload files number is " + fileChooser.files.length.toString() +'<br>';
    for(var i =0; i<fileChooser.files.length; i++){ 
            var file = fileChooser.files[i];
            if (file) {
                    // var tempFile =  file.name.replace(/\s/g, "_");
                    // filename = filelocation + '/' +tempFile;
                    // uploadresults = uploadresults + 'Begin uploading... ' + file.name + '<br>';
                    UploadFiletoBucketPromise(filelocation,file)
                    .then(function(result) {
                        idx++;
                        console.log('result = '+result);
                        uploadresults = uploadresults + '<br>' + result + 'current uploaded No. ' + idx.toString();
                        document.getElementById("status").innerHTML = uploadresults;
                    }).catch((err) => { throw err; });
            } 
       }
    });
}

// ------------------upload function-----------------------
// View all content in S3
// call this function delVideo(videoUrl,videoName)
function ViewFileinS3(bucketname,searchtxt){
    return new Promise(function (myResolve, myReject) {
    var prefix = bucketname;
    bucket.listObjects(
    {
        // Prefix: prefix,
        Prefix: prefix,
        // Delimiter='pdf'
    },

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
            var idx=0;
            data.Contents.forEach(function(obj) {
                var fileName = obj.Key;
                // var fileExtension = fileName.split('.').pop().toLowerCase();
                var fileURL = bucketName + "/" +obj.Key;
                console.log('fileName = ' + fileName);
                // console.log('fileExtension = ' + fileExtension);
                // console.log('filenameext = ' + filenameext);
                var j = fileName.indexOf(searchtxt);  
                console.log(j);
                if (j>=0){
                    idx++;
                    result = result 
                    // + '<div>' + fileExtension + '<p>' +'<br>' 
                    + '<div>' + idx.toString() + ' : ' + fileName + '<p>' +'<br>' 
                    +' <embed src= "'+ fileName + '" width="25%" height="25%" >' + '<p>' +'<br>' 
                    + '<button type="button" id ="' + fileName + '"  onclick = "delVideo(' + "'" +    fileURL  + "'," + "'" + fileName + "'" +  ')">Delete</button>' 
                    // + '</div>'
                    // +' <div>'
                    + '<button type="button" id ="' + fileName + '"  onclick = "downloadVideo(' + "'" +    fileURL  + "'," + "'" + fileName + "'" +  ')">download</button>' 
                    + '</div>'
                }

                // console.log(result);
            });
                
        }
        console.log('html = ' + result);
        myResolve(result);

        // document.getElementById("content").innerHTML =  result;
    })
});
    // document.getElementById("progress").innerHTML= "<h3>Done</h3>";

}

function PublishContent(s3url,dbtable) {
    return new Promise(function (myResolve, myReject) {
    var prefix = 'videofile';
    var publishdb='';
    var errstatus = false;
    bucket.listObjects({
        Prefix: prefix
    }, 
    function(err, data) {
        if (err) {
            errs = true;
            myReject(err);
        } else {
                var objKeys = "";
                data.Contents.forEach(function(obj) {
                    // s3url =     'https://s3.us-east-1.amazonaws.com/'
                objKeys =  obj.Key ;
                objlocation = s3url + objKeys;
                var myDate = new Date();
                var formatted_date = myDate.getFullYear() + "-" + (myDate.getMonth() + 1) + "-" + myDate.getDate() + " " + myDate.getHours() + ":" + myDate.getMinutes() + ":" + myDate.getSeconds() ;
                var ddb = new AWS.DynamoDB({apiVersion: '2012-08-10'});
                var adduser = document.getElementById("email_value").innerHTML.toString();
                var params = {
                     TableName :dbtable,
                     Item:{
                         'ID': {S: obj.Key},
                         'URL':{S: objlocation},
                         'uploadTime':{S: formatted_date},
                         'uploadUser' :{S:adduser},
                         'uploadIP' :{S:'127.0.0.1'},
                         'commentsIP':{S:'192.168.1.1'},
                         'comments':{S:'This is comments'},
                         'commentsTime':{S: formatted_date}, 
                         'idx' :{S:'1'}
                     }
                 };
                publishdb = publishdb + "Publish " + objKeys + '<br>' ;
                // alert(publishdb);
                ddb.putItem(params, function(err, data) {
                     if (err) {
                         errstatus = true;
                         myReject('Unable to add item')
                         
                     } else {
                         errstatus = false;
                     }
                }); 

            });
            if (errstatus==false){
                myResolve(publishdb);
            }
            // document.getElementById("content").innerHTML = publishdb;
            // document.getElementById("progress").innerHTML =  "<h2>Publish content Eend </h2>";
        }

    });
});
}

function downloadVideo(videoUrl,videoName){
    window.open(videoName);
}