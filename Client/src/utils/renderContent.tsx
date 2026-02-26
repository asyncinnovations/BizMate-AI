export const renderContent = (content: string, isUser: boolean) =>
  content.split("\n").map((line, i) => {
    if (line.startsWith("**") && line.endsWith("**"))
      return <p key={i} className={`font-semibold mt-2 mb-0.5 ${isUser ? "text-on-brand/90" : "text-text-heading"}`}>{line.slice(2, -2)}</p>;
    if (line.startsWith("• "))
      return <p key={i} className={`ml-3 ${isUser ? "text-on-brand/85" : "text-text-primary"}`}>{line}</p>;
    if (/^\d+\./.test(line))
      return <p key={i} className={`ml-3 ${isUser ? "text-on-brand/85" : "text-text-primary"}`}>{line}</p>;
    return line ? <p key={i} className="mb-0.5">{line}</p> : <br key={i} />;
  });
