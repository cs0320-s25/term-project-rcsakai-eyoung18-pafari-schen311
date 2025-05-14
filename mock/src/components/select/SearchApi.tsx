import "../../styles/main.css";

interface searchDisplayProps {
    output: string;
    hasSearch: boolean;
}

export function SearchApi (props: searchDisplayProps) {
    if (!props.hasSearch){
        return null
    }

    return (
        <div className="search-output" aria-label="search-result"
        aria-description={``}>
        <table>
            <tr>
                <th>Response</th>
            </tr>
            <tr>
                <td>{props.output}</td>
            </tr>
            </table>
        </div>
      );
}
