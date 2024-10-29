type Header = {
  key: string;
  label: string;
};

type ReadOnlyTableProps = {
  headers: Header[];
  data?: Record<string, any>[];
  title?: string;
};

export default function ReadOnlyTable({
  headers,
  data,
  title,
}: ReadOnlyTableProps) {
  return (
    <div className=" mt-5 flex flex-col  ">
      <h1 className="text-lg font-light text-gray-500">{title}</h1>
      <table className=" mt-4 table-auto ">
        <thead>
          <tr className="text-gray-500 border-b border-gray-500">
            {headers.map(({ key, label }) => (
              <th key={key} className="font-light text-start">
                {label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="">
          {data?.map((record, index) => (
            <tr key={index} className="text-gray-500 border-b border-gray-300">
              {headers.map(({ key }) => (
                <td key={key} className="font-light text-left py-4 ">
                  {record[key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
