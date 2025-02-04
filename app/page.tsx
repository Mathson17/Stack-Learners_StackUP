"use client";
import { db } from "./firebase";
import { collection, getDocs } from "firebase/firestore";
import React, { useState, useEffect } from "react";
import { Form } from "react-bootstrap";
import InputGroupText from "react-bootstrap/esm/InputGroupText";

async function FetchDataFromFireStore() {
  const querySnapshot = await getDocs(collection(db, "messages"));

  const data: Array<any> = [];

  for (let i = 0; i < querySnapshot.docs.length; i++) {
    data.push({
      id: querySnapshot.docs[i].id,
      ...querySnapshot.docs[i].data(),
    });
  }

  return data;
}

export default function Home() {
  const [search , setSearch] = useState('');
  const [eventData, setEventData] = useState<Array<any> | null>(null);

  useEffect(() => {
    async function FetchData() {
      const data = await FetchDataFromFireStore();
      setEventData(data);
    }
    (async () => {
      await FetchData();
    })();
  }, []);
  return (
    <main className=" bg-white ">
    
      <div className="min-h-screen min-w-full  bg-neutral-100 container py-20 px-8 ">
     
        <h1 className="text-5xl font-bold text-center text-black pb-10">
          Events
        </h1>
        <div className="pb-7 flex justify-center w-full">
        <Form >
          <InputGroupText className="my-3">
             <Form.Control onChange={(e)=>setSearch(e.target.value)} placeholder="Search Events" className="bg-white text-black border border-info rounded-circle  " size="lg" />
          </InputGroupText>
        </Form>
        </div>
        <div className="grid lg:grid-cols-4 text-black gap-16">
          {eventData &&
            eventData.filter((data)=>{return search.toLowerCase() === '' ? data : data.eventname.toLowerCase().includes(search.toLowerCase())}).map((data) => {
              return <div key={data.id}><div className="card card-compact lg:w-80 h-80  bg-white shadow-md rounded-lg' shadow-xl">
              <figure><img src="/card.jpg" alt="Shoes" /></figure>
              <div className="card-body text-black">
                <span className='text-slate-400'>Free</span>
                <h2 className="card-title">{data.eventname}</h2>
                <p className='text-xs'>{data.date}</p>
                <p>{data.description}</p>
                <div className="card-actions justify-start">
                  <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full">Register</button>
                </div>
              </div>
            </div></div>
            })}
        </div>
      </div>
    </main>
  );
}