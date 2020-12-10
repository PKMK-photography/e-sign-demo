import {useState, useEffect, useRef} from 'react';
import contractImage from '../../assets/e-sign-demo-contract.png';
const contract = new Image();
contract.src = contractImage;

const Canvas = props => {
    const canvasRef = useRef(null),
          [context, setContext] = useState(null);


    useEffect(() => {
        let mouseDown = false,
            start = {x: 0, y: 0},
            end = {x: 0, y: 0},
            canvasOffsetLeft = 0,
            canvasOffsetTop = 0;

        if(context){
            contract.onload = function(){
                context.drawImage(contract, 0, 0);
            }
        }

        function handleMouseDown(e){
            mouseDown = true;

            start = {
                x: e.clientX - canvasOffsetLeft,
                y: e.clientY - canvasOffsetTop
            };

            end = {
                x: e.clientX - canvasOffsetLeft,
                y: e.clientY - canvasOffsetTop
            }
        }

        function handleMouseUp(e){
            mouseDown = false;
        }

        function handleMouseMove(e){
            if(mouseDown && context){
                start = {
                    x: end.x,
                    y: end.y
                }

                end = {
                    x: e.clientX - canvasOffsetLeft,
                    y: e.clientY - canvasOffsetTop
                };

                context.beginPath();
                context.moveTo(start.x, start.y);
                context.lineTo(end.x, end.y);
                context.strokeStyle = '#000';
                context.lineWidth = 2;
                context.stroke();
                context.closePath();
            }
        }

        if(canvasRef.current){
            const renderCtx = canvasRef.current.getContext('2d');

            if(renderCtx){
                canvasRef.current.addEventListener('mousedown', handleMouseDown);
                canvasRef.current.addEventListener('mouseup', handleMouseUp);
                canvasRef.current.addEventListener('mousemove', handleMouseMove);
                
                canvasOffsetLeft = canvasRef.current.offsetLeft;
                canvasOffsetTop = canvasRef.current.offsetTop;

                setContext(renderCtx);
            }
        }

        return function clear(){
            canvasRef.current.removeEventListener('mousedown', handleMouseDown);
            canvasRef.current.removeEventListener('mouseup', handleMouseUp);
            canvasRef.current.removeEventListener('mousemove', handleMouseMove);
        }
    }, [context]);

    const saveContract = () => {
        const image = canvasRef.current.toDataURL("image/png").replace("image/png", "image/octet-stream");

        window.location.href=image;
    }

    const clearSignature = () => {
        context.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
        context.drawImage(contract, 0, 0);
    }

    return (
        <section>
            <canvas height='900px' width='695px' ref={canvasRef} {...props}/>
            <br/>
            <button id='save-btn' onClick={saveContract}>Save</button>
            <button id='clear-btn' onClick={clearSignature}>Clear</button>
        </section>
    )
}

export default Canvas;