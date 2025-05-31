import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

const MySwal = withReactContent(Swal);

const PruebaComponente = () => {
    return <input type="text" placeholder="Escribe algo..." />;
};

const showComponent = () => {
    MySwal.fire({
        title: "Componente React en SweetAlert2",
        html: <PruebaComponente />,
        showConfirmButton: false,
    });
};

function App() {
    return <button onClick={showComponent}>Mostrar Componente</button>;
}

export default App;
