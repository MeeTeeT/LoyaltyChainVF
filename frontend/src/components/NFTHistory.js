export function NFTHistory(data) {
  console.log("---data : ", data);
  return (
    <>
      <div className="overflow-x-auto">
        <table className="table">
          {/* head */}
          <thead>
            <tr>
              <th></th>
              <th>Action</th>
              <th>From</th>
              <th>To</th>
            </tr>
          </thead>
          <tbody>
            {data.map((item, i) => {
              return (
                <>
                  <tr>
                    <th>1</th>
                    <td>{item.transactionType}</td>
                    <td>{item.sellerFrom}</td>
                    <td>{item.To}</td>
                  </tr>
                </>
              );
            })}
          </tbody>
        </table>
      </div>
      {/*event EventTokenTransaction(
        uint256 indexed tokenId,
        address ownerFrom,
        address ownerTo,
        address sellerFrom,
        address sellerTo,
        uint256 price,
        string transactionType
    );
    
      toto*/}
    </>
  );
}

export default NFTHistory;
