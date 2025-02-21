
  
const Message = ({ text, user, isBot }) => {
    return (
      <div className={`flex ${isBot ? "justify-end" : "justify-start"} mb-2`}>
        <div className={`p-3 rounded-lg max-w-xs ${isBot ? "bg-blue-200 text-right" : "bg-green-200 text-left"}`}>
          <strong>{user}: </strong> {text}
        </div>
      </div>
    );
  };
  
  export default Message;
  