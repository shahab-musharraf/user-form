import { useRouter } from 'next/navigation';

export default function Success() {
  const router = useRouter();

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        background: 'rgba(0, 0, 0, 0.8)',
      }}
    >
      <div
        style={{
          background: '#fff',
          padding: '30px',
          borderRadius: '10px',
          textAlign: 'center',
          width: '400px',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
        }}
      >
        <h2 style={{ color: '#4CAF50', fontSize: '24px' }}>Payment Successful!</h2>
        <p style={{ marginTop: '10px', color: 'gray' }}>
          Your payment was completed successfully. Thank you for your purchase!
        </p>

        <button
          style={{
            marginTop: '20px',
            padding: '10px 20px',
            backgroundColor: '#6772e5',
            color: '#fff',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
          }}
          onClick={() => router.back()}
        >
          Go Back
        </button>
      </div>
    </div>
  );
}
