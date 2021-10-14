import json
import urllib.parse
import os, sys, math, boto3, json
import base64
import numpy as np
import cv2
# from matplotlib.pyplot import imshow

print('Loading function')
s3 = boto3.client('s3')


def parseArgs(event):
  try:
    print(event)
    bucket = event['Records'][0]['s3']['bucket']['name']
    key = urllib.parse.unquote_plus(event['Records'][0]['s3']['object']['key'], encoding='utf-8')
    return bucket, key
  except Exception as e:
    raise Exception

def downloadImage(bucket, key):
  try:
    srcBucket = bucket
    tmpFile = "/tmp/" + os.path.basename(key)
    s3.download_file(Bucket=srcBucket, Key=key, Filename=tmpFile)
    img = cv2.imread(tmpFile)
    height, width, channels = img.shape
    return img, height, width
  except Exception as e:
    raise Exception
    
# def resize_image(img,width,height):
#   try:
#     # dim = (width, height)
#     resize_image = cv2.resize(img, (width,height), interpolation = cv2.INTER_AREA)
#     return resize_image
#   except Exception as e:
#     raise Exception

def save(img, bucket, key):
  try:
    outFile = "/tmp/" + os.path.basename(key)
    cv2.imwrite(outFile, img)
    s3.upload_file(Filename=outFile, Bucket=bucket, Key=key)
    return True
  except Exception as e:
    raise Exception


#在图img的指定位置画点，c代表颜色，op代表透明度
def drawblock(img,x1,y1,c,op):
  try:
    height, width, channels = img.shape
    i=0  #op是透明度
    while i<height-1:
        if (i)%4==0:  #每隔4画一次
            if y1<width-1 and x1+i <height-1: #每次画2个点
                img[x1+i,y1]= [c,c,c,op]
                img[x1+i+1,y1]= [c,c,c,op]
        i=i+4   
  except Exception as e:
    raise Exception

#在图的指定位置x1,y1画线
def drawcolumn(img,x1,y1,c,op):
  try:
    for i in range(4):
        drawblock(img,x1+i,y1+i,c,op)
  except Exception as e:
    raise Exception
    
# 修改图片尺寸
def resize_image(image, width,height):
  try:
    dim = (width, height)
    resize_image = cv2.resize(image, dim, interpolation = cv2.INTER_AREA)
    return resize_image
  except Exception as e:
    raise Exception
    
    

def jpg2png(img,op):
  try:
    r_channel, g_channel, b_channel = cv2.split(img) 

    img_RGBA = np.insert(
        img,
        3,         #position in the pixel value [ r, g, b, a <-index [3]  ]
        op,         # or 1 if you're going for a float data type as you want the alpha  to be fully white otherwise the entire image will be transparent.
        axis=2,    #this is the depth where you are inserting this alpha channel into
    )
#     print(cv2.split(img))
    return img_RGBA
  except Exception as e:
    raise Exception


def mergeto3d(imgl,imgr,distance):
    #合成sbs
  try:
    b_channel, g_channel, r_channel,alpha_channel = cv2.split(imgl)
    print('imgl alpha_channel is ',alpha_channel)
    print('imgl ',imgl.shape)
    print('imgr ',imgr.shape)
    combined_img = imgl.copy()
    print('len(combined_img)',len(combined_img))

    for i in range(len(combined_img)):
        for j in range(len(combined_img[i]) - 24):
            if combined_img[i][j][3]==0:
                print ('i,j,combined_img[i][j][3]==0,imgr[i][j + distance][3]',i,j,combined_img[i][j][3],imgr[i][j + distance][3])
    #             print ('------ i,j,combined_img[i][j][0],imgr[i][j + distance][3]',i,j,combined_img[i][j][0],imgr[i][j + distance][0])
    #             print ('------ i,j,combined_img[i][j][1],imgr[i][j + distance][3]',i,j,combined_img[i][j][1],imgr[i][j + distance][1])
    #             print ('------ i,j,combined_img[i][j][2],imgr[i][j + distance][3]',i,j,combined_img[i][j][2],imgr[i][j + distance][2])
                combined_img[i][j][0] = imgr[i][j + distance][0]
                combined_img[i][j][1] = imgr[i][j + distance][1]
                combined_img[i][j][2] = imgr[i][j + distance][2]
                combined_img[i][j][3] = imgr[i][j + distance][3]
    print('combined_img',combined_img.shape)
    return combined_img
  except Exception as e:
    return {
      "statusCode": 505,
      "headers": {
        "Access-Control-Allow-Origin": "*",
        "Content-Type": "application/json",
      },
      "body": json.dumps({"status": "error", "message": e.args})
    }

    
    
def lambda_handler(event, context):

  # bucket = "image-store"
  # key = "test/sample.png"
  # outKey = "test/sample_out.png"
  try:
    bucket, key = parseArgs(event)
    print('bucket,key is',bucket, key)
    
    img, height,width = downloadImage(bucket, key)
    print('origin img width,height',width,height)

    width2d,height2d = 1954,1080  #改变图片宽度
    print('resize of width,height',width2d,height2d)
  
    img = resize_image(img,width2d,height2d)
    
    height, width, channels = img.shape
    print('jpg img2d shape is ',img.shape)

    img_RGBA = jpg2png(img,250)
    print('png img_RGBA shape is',img_RGBA.shape)
    
    newwidth,newheight = int(width/2),height #宽度减半，以便sbs格式
    img_RGBA = resize_image(img_RGBA,newwidth,newheight)
    
    # new 一个 sbsfull ，宽度是png2d的2X
    print('png img_RGBA shape is',img_RGBA.shape)
    
    height, width, channels = img_RGBA.shape
    sbsfull = np.zeros((height, width*2, 4), dtype=np.uint8)
    sbsfull.fill(0)
    print('sbsfull shape is',sbsfull.shape)

    sbsfull[:,0::2] = img_RGBA[:,:]
    sbsfull[:,1::2] = img_RGBA[:,:]
    sbsleft = sbsfull.copy()
    sbsright = sbsfull.copy()
    
    #开始在sbsleft和sbsright上画mask，调用drawcolumn函数
    #mask是3d膜片的斜率
    #j是height，i是width
    
    
    j= 0-height
    for i in range(0,int(width*2),4):
      j=j+1
      if j>height:
        j=0
      drawcolumn(sbsleft,j,i,255,0) # 白色不透明
      drawcolumn(sbsright,j,i,255,0) # 白色不透明    
    
    
    # 转换2d图片为3d图片PART3 
    # 读取 sbsleft.png,sbsright.png
    # 调用mergeto3d
    # 根据不同distance产生3D图
    print('sbsleft',sbsleft.shape)
    print('sbsright',sbsright.shape)
    
    result = save(sbsleft, bucket, 'sbsleft.png')
    print('result of saving sbsleft.png is',result)
    result = save(sbsright, bucket, 'sbsright.png')
    print('result of saving sbsright.png is',result)
    # imshow(sbsright)
    distance=24
    # img3d = mergeto3d(sbsleft,sbsright,distance)
    # print('finished'+ '3d'+str(distance)+'.png')
    
    
    # result = save(img3d, bucket, key+'3d'+str(distance)+'.png')
    # print('result of saving is',result)
    
    return {
      "statusCode": 200,
      "headers": {
        "Access-Control-Allow-Origin": "*",
        "Content-Type": "application/json",
      },
      "body": json.dumps({"status": "ok"})
    }
  except Exception as e:
    return {
      "statusCode": 404,
      "headers": {
        "Access-Control-Allow-Origin": "*",
        "Content-Type": "application/json",
      },
      "body": json.dumps({"status": "error", "message": e.args})
    }

