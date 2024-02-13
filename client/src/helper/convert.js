export default function convertToBase64(file){
    return new Promise((resolve,reject)=>{
        const fileName=new FileReader;
        fileName.readAsDataURL(file);
        fileName.onload=()=>{
            resolve(fileName.result);
        }

        fileName.onerror=(error)=>{
            reject(error);
        }
    })
    
    
}