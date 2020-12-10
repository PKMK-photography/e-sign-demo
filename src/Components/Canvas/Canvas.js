import {useEffect, useRef} from 'react';
import contractImage from '../../assets/e-sign-demo-contract.png';

const Canvas = props => {
    const canvasRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current,
              context = canvas.getContext('2d');

        const contract = new Image();
        contract.src = contractImage;
        console.log(contract)
        contract.onload = function(){
            context.drawImage(contract, 0, 0);
        }
    }, [])

    return <canvas height='900px' width='695px' ref={canvasRef} {...props}/>
}

export default Canvas;