import { useState } from "react";
import Gopal from "./Gopal";

function App() {
  const [name, setName] = useState<string>('Gopal')
	return (
		<div>
			<h1>Hello from chai code {name}</h1>
      <Gopal/>
		</div>
	);
}

export default App;
