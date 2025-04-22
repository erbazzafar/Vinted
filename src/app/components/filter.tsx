import React from 'react'
import Image from 'next/image'


function Filter() {

    return (
        <>
            <div className="bg-white mt-15 w-full">
                  {/* Full-width slider container matching the navbar */}
                <div className="container mx-auto max-w-screen-2xl">
                    <div className="w-full h-[400px] sm:h-[500px] md:h-[550px] lg:h-[600px] overflow-hidden rounded-xl">
                      <Image 
                        src="/cat.jpeg" 
                        alt="Slider Image"
                        width={1920}
                        height={1080}
                        unoptimized
                        className="w-full h-full object-cover rounded-lg"
                      />
                    </div>
                    <h1> this is a filter Component</h1>
                </div>
            </div>
            
            
        </>
    )
}

export default Filter
