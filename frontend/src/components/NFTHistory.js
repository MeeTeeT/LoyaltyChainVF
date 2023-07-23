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
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {data
              ? data.map((item, i) => {
                  if (item) {
                    const timestamp = item.timestamp * 1000;
                    console.log(timestamp);
                    const date = new Date(timestamp);
                    //console.log(date.toString());

                    //console.log();
                    const jour = date.getDate();
                    if (date.getDate().length === 2) {
                      jour = date.getDate();
                    } else if (date.getDate().length === 1) {
                      jour = "0" + date.getDate();
                    }
                    const mois = date.getMonth() + 1;
                    const annee = date.getFullYear();
                    const heure = date.getHours();
                    const minute = date.getMinutes();
                    console.log(mois);
                    console.log(jour);
                    console.log(annee);
                    compt++;
                    return (
                      <>
                        <tr key={i}>
                          <th>{compt}</th>
                          <td>{item.transactionType}</td>
                          <td class="truncate text-ellipsis  max-w-[10rem]">
                            {item.ownerFrom}
                          </td>
                          <td class="truncate text-ellipsis  max-w-[10rem]">
                            {item.ownerTo}
                          </td>
                          <td>
                            {jour}/{mois}/{annee} {heure}:{minute}{" "}
                          </td>
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
