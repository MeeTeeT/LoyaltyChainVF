export function NFTHistory({ data }) {
  console.log("---data : ", JSON.stringify(data));
  // alert(JSON.stringify(data));
  //const data = JSON.stringify(data);
  let compt = 0;
  return (
    <>
      <div className="overflow-x-auto h-400">
        <table className="table table-pin-rows">
          {/* head */}
          <thead>
            <tr>
              <th></th>
              <th>Event</th>
              <th>From</th>
              <th>To</th>
            </tr>
          </thead>
          <tbody>
            {data
              ? data.map((item, i) => {
                  if (item) {
                    compt++;
                    return (
                      <>
                        <tr key={i}>
                          <th>{compt}</th>
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
    </>
  );
}

export default NFTHistory;
