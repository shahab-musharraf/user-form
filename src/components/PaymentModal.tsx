import React from "react";

const PaymentModal = ({ setOpenModal }:any) => {
    const walletAddress = 'TJ6hGWCegBdn9PuDAs6Dg5WtCPX5FtLeB5';
    
  const copyToClipboard = () => {
    navigator.clipboard.writeText(walletAddress);
    alert("Wallet address copied!");
  };

  return (
    <div
      style={{
        width: "650px",
        padding: "20px",
        backgroundColor: "#fff",
        borderRadius: "8px",
        boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
        textAlign: "center",
        position:'absolute',
        top: '50%',
        left:'50%',
        transform: 'translate(-50%, -50%)'
      }}
    >
        <h2 style={{  fontSize: "18px", textAlign:'center' }}>
            Pay via QR Code or Wallet Address
        </h2>
        

        <div style={{ display:'flex', justifyContent:'center'}}>
            <img
                src={'/qr_.jpg'}
                alt="QR Code"
                style={{ width: "300px", height: "300px", marginBottom: "10px" }}
            />
        </div>

      <div style={{ margin: "10px 0", fontWeight: "bold" }}>--- OR ---</div>

      <div
        style={{
          backgroundColor: "#f5f5f5",
          padding: "10px",
          borderRadius: "5px",
          wordBreak: "break-word",
          fontSize: "14px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <span>{walletAddress}</span>
        <button
          onClick={copyToClipboard}
          style={{
            marginLeft: "10px",
            padding: "5px 10px",
            border: "none",
            backgroundColor: "#007bff",
            color: "#fff",
            borderRadius: "5px",
            cursor: "pointer",
          }}
        >
          Copy
        </button>
      </div>

      <p style={{ fontSize: "12px", color: "red", marginTop: "10px" }}>
        * Please take a screenshot after payment for reference.
      </p>




          <div style={{display:'flex', justifyContent:'center'}}>

          <p style={{cursor:'pointer', backgroundColor:'greenyellow', marginTop:'20px', width:'fit-content', padding:'10px 20px', borderRadius:'8px'}} onClick={() => setOpenModal(false)}>Close</p>

          </div>

    </div>
  );
};

export default PaymentModal;
