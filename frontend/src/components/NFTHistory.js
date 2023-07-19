export function NFTHistory({ data }) {
  console.log("---data : ", JSON.stringify(data));
  // alert(JSON.stringify(data));
  //const data = JSON.stringify(data);
  return (
    <>
      <div className="overflow-x-auto h-400">
        <table className="table table-pin-rows">
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
            {data
              ? data.map((item, i) => {
                  if (item) {
                    return (
                      <>
                        <tr key={i}>
                          <th>{i}</th>
                          <td>{item.transactionType}</td>
                          <td>{item.ownerFrom}</td>
                          <td>{item.ownerTo}</td>
                        </tr>
                      </>
                    );
                  }
                })
              : null}
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
