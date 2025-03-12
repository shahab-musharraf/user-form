import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

const Index = () => {
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [searchCriteria, setSearchCriteria] = useState("name");
  const [orderBy, setOrderBy] = useState("createdAt");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalUsers, setTotalUsers] = useState(0)
  const [emailLoading, setEmailLoading] = useState(false);
  const [paymentVerifying, setPaymentVerifying] = useState(false);
  const [deleteUserLoading, setDeleteUserLoading] = useState(false);

  const router = useRouter();

  const fetchUsers = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`/api/getAllUser?page=${page}&limit=50&orderBy=${orderBy}`);
      // if (!response.ok) throw new Error(`HTTP Error: ${response.status}`);
      console.log(response, 'fetchUser response')
      if(!response.ok){
        alert('Something went wrong')
        return;
      }
      const data = await response.json();
      console.log(data, 'fetchUser data')
      setUsers(data?.users);
      setTotalPages(data?.totalPages);
      setTotalUsers(data?.totalUsers)
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setIsLoading(false);
    }
  };
  useEffect(() => {
    if (!localStorage.getItem("adminCredential")) {
      router.push("/login");
      return;
    }


    else {
      fetchUsers();
    }
  }, [page, orderBy, router]);


  const handleLogout = () => {
    localStorage.removeItem("adminCredential");
    router.push("/login");
    alert("Logout Successfully");
  };

  const headers = users.length > 0 ? Object.keys(users[0]) : [];

  // Function to filter users based on search term
  const filteredUsers = users.filter((user) =>
    user[searchCriteria]?.toString().toLowerCase().includes(searchTerm.toLowerCase())
  );

  console.log(searchCriteria, users)
  if (isLoading) return <p style={{ textAlign: "center", marginTop: "400px" }}>Loading...</p>;


  const sendMailToUser = async (user) => {

    if(!user.paymentVerified){
      alert("Payment is not verified yet!");
      return;
    }

    if(user?.referralCount <5){
      alert("Referral Count is less than 5. Not allowed for withdrawal");
      return;
    }

    alert(`Notification sent to email: ${user?.email}`)

    setEmailLoading(true);
    try {
      const response = await fetch("/api/sendMail", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email : user.email, name: user.name }),
      });

      const data = await response.json();
      if (response.ok) {
        alert("Email sent successfully!");
      } else {
        alert(data.message || "Failed to send email");
      }
    } catch (error) {
      console.error("Error sending email:", error);
      alert("Something went wrong!");
    } finally {
      setEmailLoading(false);
    }

    fetchUsers()

  }

  console.log(emailLoading)

    const handleVerifyPayment = ( user, verify ) => {

      setPaymentVerifying(true);
      fetch('/api/updateUser', {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({...user, verify}) // Replace with actual mobile number
      })
      .then(response => response.json())
      .then(data => fetchUsers())
      .catch(error => console.error("Error:", error));

      setPaymentVerifying(false)
      
      
  }
  const handleDeleteUser = (user) => {
    setDeleteUserLoading(true)
    fetch('/api/deleteUser', {
      method:'DELETE',
      headers: {"Content-Type" : "application/json"},
      body: JSON.stringify(user)
    })
    .then(response => response.json())
    .then(data => fetchUsers())
    .catch(error => {console.log(error)})

    
    setDeleteUserLoading(false);
  }
  return (
    <div style={{ fontFamily: "sans-serif" }}>
      <div style={{ display: "flex", justifyContent: "space-between", padding: "10px 30px" }}>
        <h3 style={{ fontSize: "20px", color: "blueviolet" }}>Welcome Admin!</h3>
        <button style={{ background: "transparent", border: "none", color: "red", fontSize: "18px", cursor: "pointer" }} onClick={handleLogout}>
          Logout
        </button>
      </div>

      <div style={{ display: "flex", justifyContent: "space-between", paddingInline: "20px", marginBottom: "20px" , gap:'30px', flexWrap:'wrap-reverse'}}>
        <h2 style={{fontSize:'20px'}}>USER'S DATA {` ( Total Users: ${totalUsers} )`}</h2>
        <div style={{ display: "flex", alignItems: "center", gap: "15px", flexWrap:'wrap' }}>
          <div style={{ display: "flex", alignItems: "center", gap: "15px", flexWrap:'nowrap', }}>
            <p style={{ color: "blue", textWrap:'nowrap', alignSelf:'flex-start', minWidth:'80px' }}>Search By:</p>
            <div style={{display:'flex', alignItems:'center', gap:'15px', flexWrap:'wrap'}}>
              <div>
                <select value={searchCriteria} onChange={(e) => setSearchCriteria(e.target.value)} style={{ padding: "10px", fontSize: "16px" }}>
                  <option value="name">Name</option>
                  <option value="mobile">Mobile</option>
                  <option value="uniqueCode">Unique Code</option>
                  <option value="referralCode">Referral Code</option>
                  <option value="_id">User ID</option>
                  <option value="amount">Amount</option>
                </select>
              </div>
              <div>
                <input type="text"  placeholder={`Search by ${searchCriteria}`} value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} style={{ padding: "10px", fontSize: "16px" }} />
              </div>
            </div>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "15px", flexWrap:'nowrap'}}>
            <p style={{ color: "blue", textWrap:'nowrap', alignSelf:'flex-start', minWidth:'80px' }}>Order By:</p>
            <select value={orderBy} onChange={(e) => setOrderBy(e.target.value)} style={{ padding: "10px", fontSize: "16px" }}>
              <option value="createdAt">Created At</option>
              <option value="referralCount">Referral Count</option>
              <option value="notified">Notified Count</option>
            </select>
          </div>
        </div>
      </div>

      <div style={{ overflowX: "auto", maxWidth:'98vw',  margin: "auto" }}>
        <table style={{ width: "80%", margin: "auto", textAlign: "center", borderCollapse: "collapse" }} border={1}>
          <thead>
            <tr>
              {[...headers, "Action", "Remove"].map((header) => (
                <th style={{ padding: "5px 10px" }} key={header}>
                  {header === "_id" ? "USER ID" : header.toUpperCase()}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filteredUsers.length > 0 ? (
              filteredUsers.map((user) => (
                <tr key={user.uniqueCode}>
                  {[...headers, "Action", "Remove"].map((header) => (
                    <td style={{ whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", padding: "5px 10px" }} key={header}>
                      {header === "Remove"? (<div onClick={() => handleDeleteUser(user)} style={{color:'red', cursor:'pointer'}}>{deleteUserLoading ? 'Deleting...' : 'Delete'}</div>) : header === "notified"? <div>{user[header]} times</div> :  header === "paymentVerified" ? (
                        user[header]  ? <div style={{display:'flex', gap:'8px', alignItems:'center', justifyContent:'center'}}><div style={{ color: "green" }}>verified</div> <div style={{color:'red', fontWeight:'bolder',cursor:'pointer', }} onClick={() => handleVerifyPayment(user, false)}>X</div></div>: <div style={{ color: "blue", cursor: "pointer" }} onClick={() => handleVerifyPayment(user, true)}>{paymentVerifying? 'verifying...' :'verify'}</div>
                      ) : header === "Action" ? (
                        <div onClick={() => sendMailToUser(user)} style={{ color: (user?.referralCount >= 5  && user?.paymentVerified) ? "blue" : "gray", cursor: (user?.referralCount >= 5 && Number(user?.referralCount)%5===0 && user?.paymentVerified) ? "pointer" : "not-allowed" }}>
                          Notify
                        </div>
                      ) : header === "createdAt" ? (
                        new Date(user[header])?.toLocaleDateString() + " " + new Date(user[header])?.toLocaleTimeString()
                      ) : header === "screenshot" ? (
                        <Link target="_blank" href={user[header]}>
                          view
                        </Link>
                      ) : header === "qrCode" ? (
                        user[header] ? <Link target="_blank" href={user[header]}>
                          view
                        </Link> : '-'): (
                        user[header] === "" ? '-' : user[header]
                      )}
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={headers.length + 1}>No users found</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {totalPages> 1 && <div style={{ display: "flex", justifyContent: "center", marginTop: "20px" }}>
        <button style={{cursor:page === 1? 'not-allowed' :'pointer'}} onClick={() => setPage(page - 1)} disabled={page === 1}>Previous</button>
        <span style={{ margin: "0 15px" }}>Page {page} of {totalPages}</span>
        <button style={{cursor: page===totalPages ? 'not-allowed' :'pointer'}} onClick={() => setPage(page + 1)} disabled={page === totalPages}>Next</button>
      </div>}
    </div>
  );
};

export default Index;
