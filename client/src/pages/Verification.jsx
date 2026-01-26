import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { CircleArrowRight } from 'lucide-react';
import React, {  useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom";


const Verification = ({changeAccess}) => {
  const navigate = useNavigate();
  const [inp,setInp] = useState("");

  useGSAP(()=>{
    const tl = gsap.timeline();
    tl
    .from("input,button",{
      y:400,
      autoAlpha:0,
      duration:0.6,
      scale:0,
    },"-=0.3")
  })

  const pass = 'pass';

  function verifyPassword(){
    if(inp == '') {
      setInp('');
      return;
    };
    if(inp === pass){
      // changeAccess(true);
      navigate('/home')
    }
  }

  useEffect(()=>{
    document.querySelector("#passInp").addEventListener('keydown',(e)=>{
      if(e.key == 'Enter'){
        // verifyPassword();
      }
    })
  })

  return (
    <div className='h-[calc(100vh-4rem)] w-full bg-[#e9e8e8] flex justify-center items-center'>
      
      <div className="w-1/3 h-28 flex justify-center overflow-hidden">
        <input id='passInp' value={inp} onChange={(e) => setInp(e.target.value)} type="text" placeholder='Enter Password' 
        className='bg-white h-10 flex-1 px-3 border-none rounded-l-md outline-none'  />
        <button
          onClick={verifyPassword}
          className='p-0.5 px-2 cursor-pointer h-10 rounded-r-md border-none outline-none bg-white'>
          <CircleArrowRight size={20} />
        </button>
      </div>

    </div>
  )
}

export default Verification;
