import React from 'react';
import './features.css';

const Features = () => {
    const data = [
        {
          cover: 'fa-solid fa-truck-fast',
          title: "ส่งเร็วทันใจ",
          desc: "จัดส่งหลังสั่งซื้อสินค้า ภายใน 1-2 วันทำการ",
        },
        {
          cover: 'fa-solid fa-id-card',
          title: "การชำระเงินที่ปลอดภัย",
          desc: "การชำระเงินที่ปลอดภัย 100%",
        },
        {
          cover: 'fa-solid fa-shield',
          title: "ช้อปอย่างมั่นใจ",
          desc: "ราคาที่ดีที่สุดสำหรับคุณและสินค้าคุณภาพ",
        },
        {
          cover: 'fa-solid fa-headset',
          title: "ฝ่ายสนับสนุน",
          desc: "เราให้การสนับสนุนทุกวันแก่ลูกค้าทุกคน",
        },
          
      ]
  return (
    <>
    <section className="wrapper background">
        <div className="container grid2">
            {data.map((value,index)=>{
                return(
                    <div className="product" key={index}>
                        <div className="img icon-circle" >
                            <i className={value.cover}></i>
                        </div>
                        <h3>{value.title}</h3>
                        <p>{value.desc}</p>
                    </div>
                )
            })}
        </div>
    </section>
    </>
  )
}

export default Features