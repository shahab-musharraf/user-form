import React from "react";

const PaymentModal = ({ setOpenModal, amount }) => {
  const walletAddress = 'TJ6hGWCegBdn9PuDAs6Dg5WtCPX5FtLeB5';

  const copyToClipboard = () => {
    navigator.clipboard.writeText(walletAddress);
    alert("Wallet address copied!");
  };

  return (
    <div
      style={{
        position: "fixed", // Make sure the overlay is fixed on the screen
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "rgba(0, 0, 0, 0.5)", // Dark semi-transparent overlay
        backdropFilter: "blur(10px)", // Apply background blur effect
        zIndex: 9999, // Ensure the overlay appears above all other content
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <div
        style={{
          width: "90%", // Make it responsive
          maxWidth: "650px", // Set a max width for larger screens
          padding: "20px",
          backgroundColor: "#fff",
          borderRadius: "8px",
          boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
          textAlign: "center",
          boxSizing: 'border-box',
        }}
      >
        <h2 style={{ fontSize: "18px", textAlign: 'center' }}>
          Pay via QR Code or Wallet Address
          <p style={{ fontSize: '40px', color: 'blue' }}>${amount}</p>
        </h2>

        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <img
            src={'/qr_.jpg'}
            alt="QR Code"
            style={{
              width: "80%", // Make QR code responsive
              maxWidth: "300px", // Set a max width for the QR code
              height: "auto", // Ensure the height adjusts automatically
              marginBottom: "10px"
            }}
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
            marginBottom: "20px"
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
              textWrap:'nowrap'
            }}
          >
            Copy
          </button>
        </div>

        <p style={{ fontSize: "12px", color: "red", marginTop: "10px" }}>
          * Please take a screenshot after payment for reference.
        </p>

        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <p
            style={{
              cursor: 'pointer',
              backgroundColor: 'greenyellow',
              marginTop: '20px',
              width: 'fit-content',
              padding: '10px 20px',
              borderRadius: '8px'
            }}
            onClick={() => setOpenModal(false)}
          >
            Close
          </p>
        </div>
      </div>
    </div>
  );
};

export default PaymentModal;
