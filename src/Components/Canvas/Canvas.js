import {useState, useEffect, useRef} from 'react';
import contractImage from '../../assets/e-sign-demo-contract.png';
const contract = new Image();
contract.src = contractImage;

const Canvas = props => {
    const canvasRef = useRef(null),
          [context, setContext] = useState(null),
          [signature, setSignature] = useState(''),
          [modalView, setModalView] = useState(false),
          [previewSignature, setPreviewSignature] = useState(false);


    useEffect(() => {
        let currentRef = canvasRef.current,
            mouseDown = false,
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
                y: e.pageY - canvasOffsetTop
            };

            end = {
                x: e.clientX - canvasOffsetLeft,
                y: e.pageY - canvasOffsetTop
            }
        }

        function handleMouseUp(e){
            mouseDown = false;
        }

        function handleMouseMove(e){
            if((mouseDown && context)){
                start = {
                    x: end.x,
                    y: end.y
                }
                
                end = {
                    x: e.clientX - canvasOffsetLeft,
                    y: e.pageY - canvasOffsetTop
                };
                
                    context.beginPath();
                    context.moveTo(start.x, start.y);
                    context.lineTo(end.x, end.y);
                    context.strokeStyle = '#000';
                    context.lineWidth = 1;
                    context.stroke();
                    context.closePath();
            }
        }

        if(currentRef){
            const renderCtx = currentRef.getContext('2d');

            if(renderCtx){
                currentRef.addEventListener('mousedown', handleMouseDown);
                currentRef.addEventListener('mouseup', handleMouseUp);
                currentRef.addEventListener('mousemove', handleMouseMove);
                
                canvasOffsetLeft = currentRef.offsetLeft;
                canvasOffsetTop = currentRef.offsetTop;

                setContext(renderCtx);
            }
        }

        return function clear(){
            currentRef.removeEventListener('mousedown', handleMouseDown);
            currentRef.removeEventListener('mouseup', handleMouseUp);
            currentRef.removeEventListener('mousemove', handleMouseMove);
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

    const adoptSignature = () => {
        context.font = '24px Cedarville Cursive, cursive';
        context.fillText(signature, 90, 720);
        setPreviewSignature(false);
        setModalView(false); 
    }

    return (
        <section className='canvas'>
            <canvas height='900px' width='695px' ref={canvasRef} {...props}/>
            <br/>
            <section>
                <button id='save-btn' onClick={saveContract}>Save</button>
                <button id='clear-btn' onClick={clearSignature}>Clear</button>
                <button id='create-btn' onClick={() => setModalView(true)}>Create</button>
            </section>
            {modalView
                ? (
                    <section className='modal-backdrop'>
                        <section className='signature-modal'>
                            <section id='step-one'>
                                <h3>Step One: Type your name</h3>
                                <input value={signature} onChange={e => setSignature(e.target.value)}/>
                                <br/>
                                <button onClick={() => setPreviewSignature(true)}>Preview</button>
                            </section>
                            <section id='step-two'>
                                <h3>Step Two: Preview Signature</h3>
                            {previewSignature
                                ? ( 
                                    <>
                                        <p id='signature-preview'>{signature}</p>
                                        <button id='change-signature' onClick={() => setPreviewSignature(false)}>Change</button>
                                        <button id='adopt-signature' onClick={adoptSignature}>Adopt & Sign</button>
                                    </>
                                )
                                : null}
                            </section>
                        </section>
                    </section>
                )
                : null}
        </section>
    )
}

export default Canvas;