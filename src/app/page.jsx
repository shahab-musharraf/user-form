
'use client';

import PaymentModal from '@/components/PaymentModal';
import ThankYou from '@/pages/ThankYou';
import { loadStripe } from '@stripe/stripe-js';
import { useEffect, useState } from 'react';

export default function HomePage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    mobile: '',
    bank: '',
    ifsc: '',
    branch: '',
    referralCode: '',
    amount: '',
    file: null,
    screenshot: "",
    uniqueCode: "",
    binanceWallet: '',
    qrCode:'',
    qrCodeFile: null
  });

  // const [popupOpen, setPopupOpen] = useState(true);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if(name === 'amount' && isNaN(value)){
      return;
    }
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    setFormData((prev) => ({ ...prev, file: e.target.files[0] }));
  };

  const handleQrFileChange = (e) => {
    setFormData((prev) => ({ ...prev, qrCodeFile: e.target.files[0] }));
  };

  const [imageUploaded, setImageUploaded] = useState(false)
  const [qrUploaded, setQrUploaded] = useState(false)

  const [uploadImageLoading, setUploadImageLoading] = useState(false);
  const [uploadQrLoading, setUploadQrLoading] = useState(false);
  const handleImageUpload = async (e) => {
    setUploadImageLoading(true);
    if(!formData?.amount){
      alert("Please do payment first")
      return
    }

    if(formData?.screenshot){
      alert("Already Uploaded!");
      return;
    }
    const form = new FormData();
    if (formData.file) form.append('file', formData.file);
    try {
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: form,
      });

      const result = await response.json();
      console.log(result);

      if (result.success) {
        formData.screenshot = result.imageUrl;
        // setFormData({...formData, screenshot: result.imageUrl})
        setImageUploaded(true)
      } else {
        alert(`Upload failed: ${result.error}`);
      }
      setUploadImageLoading(false);
    } catch (error) {
      console.error('Error uploading file:', error);
      setUploadImageLoading(false);
    }
    
  }


  const handleQrUpload = async (e) => {
    setUploadQrLoading(true);
    if(!formData?.amount){
      alert("Please do payment first")
      return
    }

    if(formData?.qrCode){
      alert("Already Uploaded!");
      return;
    }
    const form = new FormData();
     if (formData.qrCodeFile) form.append('file', formData.qrCodeFile);
    try {
      const response = await fetch('/api/qr-upload', {
        method: 'POST',
        body: form,
      });

      const result = await response.json();

      if (result.success) {
        formData.qrCode = result.imageUrl;
        setQrUploaded(true)
      } else {
        alert(`Upload failed: ${result.error}`);
      }
      setUploadQrLoading(false);
    } catch (error) {
      console.error('Error uploading file:', error);
      setUploadQrLoading(false);
    }
    
  }

  const [thankyouPopup, setThankyouPopup] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const [loading, setLoading]  = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if(submitted){
      alert("You have already submitted!")
      return;
    }

    if(!Number(formData?.mobile)){
      alert("Please Enter Valid Mobile Number!")
      return;
    }

    if(!(formData?.name && formData?.binanceWallet  && formData?.email && formData?.mobile && formData?.bank && formData?.ifsc && formData?.branch && formData?.amount)){
      alert("Please fill the required details first")
      return 
    }
    if(!formData.screenshot){
      alert("Please Upload payment screenshot first")
      return;
    }
    if(!formData.qrCode){
      alert("Please Upload payment screenshot first")
      return;
    }

    sessionStorage.removeItem("userData")

    const form = new FormData();
    form.append('name', formData.name);
    form.append('email', formData.email);
    form.append('mobile', formData.mobile);
    form.append('bank', formData.bank);
    form.append('ifsc', formData.ifsc);
    form.append('branch', formData.branch);
    form.append('amount', formData.bank);
    form.append('screenshot', formData.screenshot)
    form.append('binance', formData.binanceWallet)
    form.append('qrCode', formData.qrCode)

    const uniqueCode = Date.now()
    setFormData({...formData, uniqueCode: uniqueCode.toString()})

    try {
      setLoading(true)
      const response = await fetch('/api/addUser', {
        method: 'POST',
        body: JSON.stringify({...formData, uniqueCode: uniqueCode.toString()}),
      });


      const result = await response.json();

      if (result.success) {
        alert("Form Submitted Successfully!")
        setSubmitted(true)
        // setPopupOpen(false);
        setThankyouPopup(true)
      } else {
        alert(result.message || 'Form Submission Failed');
      }
      setLoading(false)
    } catch (error) {
      console.error(error);
    }



  };

  
  // const [paymentLoading, setPaymentLoading] = useState(false);

  const handlePayClick =async () => {
    if(!(formData?.name && formData?.binanceWallet && formData?.email && formData?.mobile && formData?.bank && formData?.ifsc && formData?.branch && formData?.amount)){
      alert("Please fill the required details first")
      return 
    }

    if (!formData?.amount || isNaN(formData?.amount) || Number(formData?.amount) <= 0) {
      alert('Please enter a valid amount.');
      return;
    }

    sessionStorage.setItem("userData", JSON.stringify(formData))
    // setPaymentLoading(true);
    setOpenModal(true)
    
    
  };
  const addAmount = (amount) => {
    setFormData((prev) => ({
      ...prev,
      amount: (Number(prev.amount) + amount).toString(),
    }));
  };

  useEffect(() => {
    if(sessionStorage.getItem('userData')){
      const userData= sessionStorage.getItem("userData");
      if(userData){
        setFormData(JSON.parse(userData))
      }
    }
  }, [])

  const [openModal, setOpenModal] = useState(false);

  // console.log(sessionStorage.getItem('userData'), formData)
  return (
    <>
      <div>
      <div>
      

      {(
        <div
          style={{
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0, 0, 0, 0.7)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding:'20px'
          }}
        >
          <div
            style={{
              position:'relative',
              background: '#fff',
              padding: '30px',
              borderRadius: '10px',
              width: '400px',
              boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
            }}
          >
            
            <h2
              style={{
                marginBottom: '20px',
                color: '#333',
                textAlign: 'center',
                fontSize: '24px',
              }}
            >
              Investment Form
            </h2>
            <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: '15px' }}>
                <input
                  type="text"
                  name="referralCode"
                  placeholder='Refer Code (Optional)'
                  value={formData.referralCode}
                  onChange={handleChange}
                  style={{
                    width: '100%',
                    padding: '10px',
                    border: '1px solid #ddd',
                    borderRadius: '5px',
                    fontSize: '14px',
                  }}
                />
              </div>
              <div style={{ marginBottom: '15px' }}>
                <input
                  type="text"
                  name="name"
                  placeholder='Name'
                  value={formData.name}
                  onChange={handleChange}
                  required
                  style={{
                    width: '100%',
                    padding: '10px',
                    border: '1px solid #ddd',
                    borderRadius: '5px',
                    fontSize: '14px',
                  }}
                />
              </div>
              <div style={{ marginBottom: '15px' }}>
                <input
                  type="email"
                  name="email"
                  placeholder='Email'
                  value={formData.email}
                  onChange={handleChange}
                  required
                  style={{
                    width: '100%',
                    padding: '10px',
                    border: '1px solid #ddd',
                    borderRadius: '5px',
                    fontSize: '14px',
                  }}
                />
              </div>
              <div style={{ marginBottom: '15px' }}>
                <input
                  type="tel"
                  name="mobile"
                  placeholder='Mobile'
                  value={formData.mobile}
                  onChange={handleChange}
                  required
                  style={{
                    width: '100%',
                    padding: '10px',
                    border: '1px solid #ddd',
                    borderRadius: '5px',
                    fontSize: '14px',
                  }}
                />
              </div>
              <div style={{ marginBottom: '15px' }}>
                <select
                  name="bank"
                  value={formData.bank}
                  onChange={handleChange}
                  required
                  style={{
                    width: '100%',
                    padding: '10px',
                    border: '1px solid #ddd',
                    borderRadius: '5px',
                    fontSize: '14px',
                    color: '#555',
                  }}
                >
                  <option value="">Select Bank</option>
                  <option value="State Bank of India">State Bank of India</option>
                  <option value="HDFC Bank">HDFC Bank</option>
                  <option value="ICICI Bank">ICICI Bank</option>
                  <option value="Axis Bank">Axis Bank</option>
                  <option value="Punjab National Bank">Punjab National Bank</option>
                  <option value="Bank of Baroda">Bank of Baroda</option>
                  <option value="Kotak Mahindra Bank">Kotak Mahindra Bank</option>
                  <option value="Union Bank of India">Union Bank of India</option>
                  <option value="Canara Bank">Canara Bank</option>
                  <option value="IndusInd Bank">IndusInd Bank</option>
                  <option value="IDFC First Bank">IDFC First Bank</option>
                  <option value="Yes Bank">Yes Bank</option>
                  <option value="Bank of India">Bank of India</option>
                  <option value="Indian Bank">Indian Bank</option>
                  <option value="Central Bank of India">Central Bank of India</option>
                  <option value="UCO Bank">UCO Bank</option>
                  <option value="Bank of Maharashtra">Bank of Maharashtra</option>
                  <option value="Federal Bank">Federal Bank</option>
                  <option value="South Indian Bank">South Indian Bank</option>
                  <option value="Karur Vysya Bank">Karur Vysya Bank</option>
                  <option value="RBL Bank">RBL Bank</option>
                  <option value="DCB Bank">DCB Bank</option>
                  <option value="IDBI Bank">IDBI Bank</option>
                  <option value="Jammu and Kashmir Bank">Jammu and Kashmir Bank</option>
                  <option value="Karnataka Bank">Karnataka Bank</option>
                  <option value="Tamilnad Mercantile Bank">Tamilnad Mercantile Bank</option>
                  <option value="Bandhan Bank">Bandhan Bank</option>
                  <option value="Dhanlaxmi Bank">Dhanlaxmi Bank</option>
                  <option value="Nainital Bank">Nainital Bank</option>
                  <option value="other">Other</option>

                </select>
              </div>
              <div style={{ marginBottom: '15px' }}>
                <input
                  type="text"
                  name="ifsc"
                  placeholder='IFSC Code'
                  value={formData.ifsc}
                  onChange={handleChange}
                  required
                  style={{
                    width: '100%',
                    padding: '10px',
                    border: '1px solid #ddd',
                    borderRadius: '5px',
                    fontSize: '14px',
                  }}
                />
              </div>
              <div style={{ marginBottom: '15px' }}>
                <input
                  type="text"
                  name="branch"
                  placeholder='Branch Name'
                  value={formData.branch}
                  onChange={handleChange}
                  required
                  style={{
                    width: '100%',
                    padding: '10px',
                    border: '1px solid #ddd',
                    borderRadius: '5px',
                    fontSize: '14px',
                  }}
                />
              </div>
              <div style={{ marginBottom: '15px' }}>
                <input
                  type="text"
                  name="binanceWallet"
                  placeholder='Binance Wallet'
                  value={formData.binanceWallet}
                  onChange={handleChange}
                  required
                  style={{
                    width: '100%',
                    padding: '10px',
                    border: '1px solid #ddd',
                    borderRadius: '5px',
                    fontSize: '14px',
                  }}
                />
              </div>
              {!imageUploaded && <div style={{ marginBottom: '15px', position: 'relative' }}>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    position: 'relative',
                  }}
                >
                  <input
                    type="text"
                    name="amount"
                    value={formData.amount}
                    onChange={handleChange}
                    required
                    placeholder="Enter amount"
                    style={{
                      flex: 1,
                      padding: '10px',
                      border: '1px solid #ddd',
                      borderRadius: '5px 0 0 5px',
                      fontSize: '14px',
                    }}
                  />
                  <button
                    type="button"
                    onClick={handlePayClick}
                    style={{
                      padding: '10px 15px',
                      border: 'none',
                      background: '#007BFF',
                      color: '#fff',
                      borderRadius: '0 5px 5px 0',
                      cursor: 'pointer',
                      fontSize: '14px',
                    }}
                  >
                    {'Invest'}
                  </button>
                </div>
                <div
                  style={{
                    display: 'flex',
                    gap: '10px',
                    marginTop: '10px',
                  }}
                >
                <button
                    type="button"
                    onClick={() => addAmount(55)}
                    style={{
                      flex: 1,
                      padding: '10px',
                      border: '1px solid #ddd',
                      background: '#f8f9fa',
                      borderRadius: '5px',
                      cursor: 'pointer',
                      fontSize: '14px',
                    }}
                  >
                    +55$
                  </button>
                  <button
                    type="button"
                    onClick={() => addAmount(100)}
                    style={{
                      flex: 1,
                      padding: '10px',
                      border: '1px solid #ddd',
                      background: '#f8f9fa',
                      borderRadius: '5px',
                      cursor: 'pointer',
                      fontSize: '14px',
                    }}
                  >
                    +100$
                  </button>
                  <button
                    type="button"
                    onClick={() => addAmount(200)}
                    style={{
                      flex: 1,
                      padding: '10px',
                      border: '1px solid #ddd',
                      background: '#f8f9fa',
                      borderRadius: '5px',
                      cursor: 'pointer',
                      fontSize: '14px',
                    }}
                  >
                    +200$
                  </button>
                  
                </div>
              </div>}
              {
                !imageUploaded ? <div style={{ marginBottom: '15px' }}>
                <label
                  style={{
                    display: 'flex',
                    marginBottom: '5px',
                    fontSize: '14px',
                    cursor:'pointer',
                    backgroundColor:  '#eee',
                    padding: formData?.file ? '0 0 0 15px' : '10px 20px',
                    
                    width:'100%',
                    textAlign:'center',
                    border:  '1px solid #aaa',
                    justifyContent: formData?.file ? 'space-between' : 'center',
                    alignItems:'center',
                    gap: formData?.file ? '10px' : 0,
                    borderRadius: '5px'

                  }}
                >
                  {formData?.file ? (formData?.file?.name?.length >18 ? formData?.file?.name?.substring(0,10) + '...' + formData?.file?.name?.substring(formData?.file?.name?.length - 6) : formData?.file?.name) : "Upload Payment Screenshot"}
                  <div>{formData?.file && 
                    
                    (
                      <div style={{
                        display:'flex',
                        gap:'5px'
                      }}>
                        <button style={{padding: '10px 15px',
                            border: 'none',
                            color: '#007BFF',
                            fontWeight:'semi-bold',
                            cursor: 'pointer',
                            fontSize: '13px',}} onClick={(e) => {
                              setFormData({...formData, file:null})
                            }}>Select Again</button>
                        <button style={{padding: '10px 15px',
                            border: 'none',
                            background: '#28a745',
                            color: '#fff',
                            borderRadius: '0 5px 5px 0',
                            cursor: 'pointer',
                            fontSize: '13px',}} type='button' onClick={handleImageUpload}>{uploadImageLoading? 'wait...': 'Upload'}</button>
                        
                      </div>
                    )
                    
                    }</div>
                
                <input
                  type="file"
                  onChange={handleFileChange}
                  style={{
                    width: '100%',
                    padding: '5px',
                    fontSize: '14px',
                    display:'none'
                  }}
                />
                </label>
              </div> : <div style={{display:'flex', justifyContent:'space-between' , alignItems:'center'}}>
                  <p style={{color: 'green'}}>Image Uploaded Successfully!</p>
                <img src={formData?.screenshot} width={100} height={100}/>
              </div>
              }







              {
                !qrUploaded ? <div style={{ marginBottom: '15px' }}>
                <label
                  style={{
                    display: 'flex',
                    marginBottom: '5px',
                    fontSize: '14px',
                    cursor:'pointer',
                    backgroundColor:  '#eee',
                    padding: formData?.qrCodeFile ? '0 0 0 15px' : '10px 20px',
                    
                    width:'100%',
                    textAlign:'center',
                    border:  '1px solid #aaa',
                    justifyContent: formData?.qrCodeFile ? 'space-between' : 'center',
                    alignItems:'center',
                    gap: formData?.qrCodeFile ? '10px' : 0,
                    borderRadius: '5px',
                    marginTop:'5px'

                  }}
                >
                  {formData?.qrCodeFile ? (formData?.qrCodeFile?.name?.length >18 ? formData?.qrCodeFile?.name?.substring(0,10) + '...' + formData?.qrCodeFile?.name?.substring(formData?.qrCodeFile?.name?.length - 6) : formData?.qrCodeFile?.name) : "Upload QR Code"}
                  <div>{formData?.qrCodeFile && 
                    
                    (
                      <div style={{
                        display:'flex',
                        gap:'5px'
                      }}>
                        <button style={{padding: '10px 15px',
                            border: 'none',
                            color: '#007BFF',
                            fontWeight:'semi-bold',
                            cursor: 'pointer',
                            fontSize: '13px',}} onClick={(e) => {
                              setFormData({...formData, qrCodeFile:null})
                            }}>Select Again</button>
                        <button style={{padding: '10px 15px',
                            border: 'none',
                            background: '#28a745',
                            color: '#fff',
                            borderRadius: '0 5px 5px 0',
                            cursor: 'pointer',
                            fontSize: '13px',}} type='button' onClick={handleQrUpload}>{uploadQrLoading? 'wait...' : 'Upload QR'}</button>
                        
                      </div>
                    )
                    
                    }</div>
                
                <input
                  type="file"
                  onChange={handleQrFileChange}
                  style={{
                    width: '100%',
                    padding: '5px',
                    fontSize: '14px',
                    display:'none'
                  }}
                />
                </label>
              </div> : <div style={{display:'flex', justifyContent:'space-between' , alignItems:'center'}}>
                  <p style={{color: 'green'}}>QR Uploaded Successfully!</p>
                  {formData?.qrCode && formData?.qrCode !== "" ? (
                      <img src={formData?.qrCode} width={100} height={100} alt="Uploaded QR Code" />
                    ) : null}

              </div>
              }















            <button
              type="submit"
              style={{
                marginTop: '20px',
                backgroundColor: 'tomato',
                color: '#fff',
                padding: '10px 20px',
                border: 'none',
                borderRadius: '5px',
                cursor: 'pointer',
                fontSize: '16px',
                width: '100%',
              }}
            >
              {loading? 'Submiting...' :'Submit'}
            </button>
            </form>
          </div>

          <div>

          </div>
        </div>
      )}
      {thankyouPopup && <ThankYou referCode = {formData.uniqueCode} setThankyouPopup = {setThankyouPopup}/>}
    </div>
      </div>

      {openModal && <PaymentModal setOpenModal={setOpenModal} amount={formData?.amount}/>}
    </>
  );
}
