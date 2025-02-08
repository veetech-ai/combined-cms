import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

export default function StorePage() {
  const { id } = useParams<{ id: string }>();

  const [menuData, setMenuData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMenu = async () => {
      try {
        // const response = await fetch('https://live.fastn.ai/api/v1/getMenu', {
        //   method: 'POST',
        //   headers: {
        //     'x-fastn-api-key': 'e2ea1416-f354-4353-bbd1-5068969ce8b4',
        //     'Content-Type': 'application/json',
        //     'x-fastn-space-id': '2cade1a6-133a-4344-86bf-c3b6f2bbfbe1',
        //     stage: 'DRAFT',
        //     'x-fastn-space-tenantid': 'veetech_customer2'
        //   },
        //   body: JSON.stringify({
        //     input: {}
        //   })
        // });
        const url =
          'https://bq2pgkc2c7.execute-api.us-east-1.amazonaws.com/menu';

        const response = await fetch(url, {
          method: 'GET',
          headers: {
            Authorization: 'Bearer acca0c85-6c26-710f-4390-23676eae487c'
          }
        });
        if (!response.ok) {
          throw new Error(`Error: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();
        console.log(data.elements);
        setMenuData(data.elements || []);
      } catch (err: any) {
        if (err.contains('429')) {
          console.log(err.message);
        }
        setError(err.message);
      }
    };

    fetchMenu();
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-gray-100">
      {/* <div className="text-center mb-6">
        <h1 className="text-2xl font-bold mb-2">TEST STORE</h1>
        <p className="text-gray-600">Store ID: {id}</p>
      </div> */}
      <div className="w-full max-w-8xl">
        <h1 className="text-lg font-semibold mb-4">
          Menu from Kioskapp (Mexikhana)
        </h1>
        {error ? (
          <p style={{ color: 'red' }}>Error: {error}</p>
        ) : !menuData ? (
          <p>Loading...</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {menuData.map((item: any) => (
              <div
                key={item.id}
                className="p-4 bg-white rounded-lg shadow-md hover:shadow-lg"
              >
                <img
                  src={
                    'https://toppng.com/uploads/preview/clipart-free-seaweed-clipart-draw-food-placeholder-11562968708qhzooxrjly.png'
                  }
                  alt="food"
                  className="w-50 h-50 rounded-md shadow-md"
                />
                <h2 className="text-xl font-bold mb-2 mt-3">{item.name}</h2>
                <p className="text-gray-700">
                  <strong>Price:</strong> ${(item.price / 100).toFixed(2)}
                </p>
                <p className="text-gray-700">
                  <strong>Available:</strong> {item.available ? 'Yes' : 'No'}
                </p>
                {/* <p className="text-gray-700">
                  <strong>Hidden:</strong> {item.hidden ? 'Yes' : 'No'}
                </p>
                <p className="text-gray-700">
                  <strong>Modified Time:</strong>{' '}
                  {new Date(item.modifiedTime).toLocaleString()}
                </p> */}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
