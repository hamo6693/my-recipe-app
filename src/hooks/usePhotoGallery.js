import { Camera, CameraResultType, CameraSource, Photo } from '@capacitor/camera';
import { useState } from 'react';

export function usePhotoGallery(){
    const [blobUrl,setBlobUrl] = useState()
    try{
        const takePhoto = async () => {
            const cameraPhoto = await Camera.getPhoto({
                resultType:CameraResultType.Uri,
                source:CameraSource.Prompt,
                quality:70,
                promptLabelHeader:"صورة"
            });
            setBlobUrl(cameraPhoto.webPath)
        }

    return{
        takePhoto,
        blobUrl
    }
}catch(e){
    console.log("j")
}
}