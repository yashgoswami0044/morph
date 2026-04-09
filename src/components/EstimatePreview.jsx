import React from 'react';

const EstimatePreview = ({ estimate, lead }) => {
  if (!estimate) return null;

  // CSS classes for consistent styling
  const tableTh = "border border-gray-400 p-2 text-left text-xs font-bold bg-gray-100 text-gray-800 uppercase";
  const tableTd = "border border-gray-400 p-2 text-xs text-gray-800";
  const numTd = "border border-gray-400 p-2 text-xs text-right text-gray-800 font-medium";

  return (
    <div className="bg-white shadow-lg print:shadow-none" style={{ width: '100%', minWidth: '210mm', maxWidth: '210mm', minHeight: '297mm', margin: '0 auto', fontFamily: 'Arial, sans-serif', color: '#000', boxSizing: 'border-box' }}>
      <div className="p-10 mx-auto bg-white text-black print:p-0" style={{ width: '100%' }}>

        {/* Header */}
        <div className="flex justify-between items-center border-b-2 border-gray-800 pb-4 mb-8">
          <div>
            <img src="data:image/png;base64,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" style={{ height: 50, marginBottom: 8 }} alt="MORPH" />
            <p className="text-xs text-gray-900 mt-1 uppercase">Residential / Commercial / Hospitality</p>
            <p className="text-xs font-medium text-gray-600">www.morphdesigns.com</p>
          </div>
          <div className="text-right">
            <h2 className="text-center text-lg font-bold uppercase mb-6 underline underline-offset-4">Home Interiors Quotation</h2>
          </div>
        </div>

        {/* Client Info */}
        <div className="mb-8">


          <div className="flex justify-between text-sm">
            <div>
              <p><strong>Client:</strong> {lead?.name}</p>
              <p><strong>Project:</strong> {lead?.project || 'N/A'}</p>
              <p><strong>Unit No.:</strong> {lead?.config || 'N/A'}</p>
            </div>
            <div className="text-right">
              <p><strong>Contact no.:</strong> {lead?.phone}</p>
              <p><strong>Date:</strong> {new Date(estimate.date).toLocaleDateString('en-IN')}</p>
            </div>
          </div>
        </div>

        {/* Room Summaries */}
        {estimate.rooms.map((room) => {
          let slNo = 1;

          const sectionsObj = {};
          room.items.forEach(item => {
            const sec = item.section || 'General';
            if (!sectionsObj[sec]) sectionsObj[sec] = [];
            sectionsObj[sec].push(item);
          });

          return (
            <div key={room.id} className="mb-8 break-inside-avoid">
              <div className="bg-[#a88944] text-white p-2 font-bold uppercase text-sm mb-2">
                Room Summary: {room.name}
              </div>
              <table className="w-full border-collapse">
                <thead>
                  <tr>
                    <th className={`${tableTh} w-12`}>Sl. No.</th>
                    <th className={`${tableTh} w-48`}>Product Summary</th>
                    <th className={tableTh}>Material Description</th>
                    <th className={`${tableTh} w-24 text-right`}>Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {Object.entries(sectionsObj).map(([sectionName, items]) => (
                    <React.Fragment key={sectionName}>
                      <tr>
                        <td className={tableTd}></td>
                        <td className={`${tableTd} font-bold text-gray-800 bg-gray-50 uppercase text-[10px] tracking-wider`} colSpan={3}>{sectionName}</td>
                      </tr>
                      {items.map((item) => (
                        <tr key={item.id}>
                          <td className={`${tableTd} text-center`}>{slNo++}</td>
                          <td className={tableTd}>{item.product}</td>
                          <td className={tableTd}>{item.material}</td>
                          <td className={numTd}>{!room.isLumpsum && item.amount ? `₹${item.amount.toLocaleString()}` : ''}</td>
                        </tr>
                      ))}
                    </React.Fragment>
                  ))}
                  <tr>
                    <td colSpan={3} className={`${tableTd} text-right font-bold`}>Total for {room.name}</td>
                    <td className={`${numTd} font-bold bg-gray-50`}>
                      ₹{(room.isLumpsum ? Number(room.lumpsumAmount || 0) : room.items.reduce((s, i) => s + (Number(i.amount) || 0), 0)).toLocaleString()}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          );
        })}

        {/* Project Summary */}
        <div className="mb-10 page-break-before-auto">
          <div className="bg-gray-800 text-white p-2 font-bold uppercase text-sm mb-2 mt-8">
            Project Summary
          </div>
          <table className="w-full border-collapse">
            <thead>
              <tr>
                <th className={`${tableTh} w-16`}>Sl.No.</th>
                <th className={tableTh}>Room</th>
                <th className={`${tableTh} w-40 text-right`}>Amount</th>
              </tr>
            </thead>
            <tbody>
              {estimate.rooms.map((room, idx) => (
                <tr key={room.id}>
                  <td className={`${tableTd} text-center`}>{idx + 1}</td>
                  <td className={tableTd}>{room.name}</td>
                  <td className={numTd}>
                    ₹{(room.isLumpsum ? Number(room.lumpsumAmount || 0) : room.items.reduce((s, i) => s + (Number(i.amount) || 0), 0)).toLocaleString()}
                  </td>
                </tr>
              ))}
              <tr>
                <td colSpan={2} className={`${tableTd} text-right font-bold`}>Sub Total</td>
                <td className={`${numTd} font-bold`}>₹{(estimate.subTotal || 0).toLocaleString()}</td>
              </tr>
              {(estimate.discounts || [{ name: 'Discount (EL)', amount: estimate.discount || 0 }]).filter(d => d.amount > 0).map((disc, idx) => (
                <tr key={idx}>
                  <td colSpan={2} className={`${tableTd} text-right font-bold text-red-600`}>{disc.name || 'Discount'}</td>
                  <td className={`${numTd} font-bold text-red-600`}>-₹{(disc.amount || 0).toLocaleString()}</td>
                </tr>
              ))}
              <tr>
                <td colSpan={2} className={`${tableTd} text-right font-black text-lg bg-gray-100`}>Grand Total</td>
                <td className={`${numTd} font-black text-lg bg-gray-100`}>₹{(estimate.grandTotal || 0).toLocaleString()}</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div className="break-inside-avoid mt-8">
          <div className="text-xs mb-6">
            <h3 className="font-bold uppercase border-b border-gray-300 pb-1 mb-2 text-gray-800">Standard Material Specification</h3>
            <ul className="list-disc pl-5 space-y-1 text-gray-700">
              <li>PLY - Century / Green Ply (BWP GRADE ISI 710)</li>
              <li>Hardware - Hafele, Hettich</li>
              <li>Laminates - CenturyLam, Merino Glossmeister, Rehau</li>
              <li>Glass / Mirrors - Saint Gobain</li>
            </ul>
          </div>

          <div className="text-xs mb-8">
            <h3 className="font-bold uppercase border-b border-gray-300 pb-1 mb-2 text-gray-800">Terms & Conditions</h3>
            <ul className="list-disc pl-5 space-y-1 text-gray-700">
              <li>All taxes are included</li>
              <li>This quotation is valid for 07 days</li>
              <li>Payment Terms: Booking advance 1.00 Lakh (non-refundable), 50% advance on Production sign off, Balance at the time of dispatch from factory</li>
              <li>Payments to be in favour of 'Morph' via cheque, wire transfer or DD.</li>
              <li>Orders once placed cannot be cancelled or modified.</li>
              <li>Octroi & transportation charges will be levied for out station sites</li>
              <li>Warranty 05 year against any manufacturing defect</li>
              <li>This is an approximate cost. Based on changes in design and size cost may vary.</li>
            </ul>
          </div>

          <div className="text-center mt-12 pb-8 text-gray-800">
            <p className="text-xl font-bold uppercase tracking-wide">Thank You!</p>
          </div>
        </div>

      </div>
    </div>
  );
};

export default EstimatePreview;
