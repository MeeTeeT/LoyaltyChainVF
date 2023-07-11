export function NFTHistory({ data }) {
  //console.log("---data : ", JSON.stringify(data));
  // alert(JSON.stringify(data));
  //const data = JSON.stringify(data);
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
            {data
              ? data.map((item, i) => {
                  return (
                    <>
                      <tr>
                        <th>{i}</th>
                        <td>{item.transactionType}</td>
                        <td>{item.ownerFrom}</td>
                        <td>{item.ownerTo}</td>
                      </tr>
                    </>
                  );
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
