const formatLastModified = (dateString) => {
  if (!dateString) return "Never modified";

  const date = new Date(dateString);

  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();

  const hour = String(date.getHours()).padStart(2, "0");
  const minute = String(date.getMinutes()).padStart(2, "0");

  return `${day}/${month}/${year}, ${hour}:${minute}`;
};

function LastModifiedLine({ lastModified }) {
    
    return (
        <div className="last-modified">
          <span className="status-dot"></span>
          Last modified at {formatLastModified(lastModified)}
        </div>
    )
}

export default LastModifiedLine