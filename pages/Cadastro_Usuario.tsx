import Router from "next/router";
import { useState } from "react";
import { Modal } from "react-bootstrap";
import { executeRequest } from "../services/api";



export default function CadastroUsuario() {

    const [showModal, setShowModal] = useState(false);
    const [mensagemModal, setMensagemModal] = useState('');

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');

    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const backToLogin = async () => {
        localStorage.clear();
        Router.push('/');
    }

    const doCadastro = async () => {
        try{
            setError('');
            if(!email || !password || !name){
                setError('Favor preencher os campos!');
                return
            }

            setLoading(true);

            const body = {
                email,
                password,
                name
            };
            console.log(body);
            const result = await executeRequest('user', 'post', body);
            if(result && result.data){
                const obj = result.data;
                setMensagemModal(result.data.msg);
                setShowModal(true);
            }
        }catch(e : any){
            console.log(`Erro ao cadastrar usuário: ${e}`);
            if(e?.response?.data?.error){
                setError(e.response.data.error);
            }else{
                setError(`Erro ao cadastrar usuário, tente novamente.`);
            }
        }

        setLoading(false);
    }

    return (
        <>
            <div className="container-login">
                <img src="/logo.svg" alt="Logo Fiap" className="logo" />
                <div className="form">
                    <h2 className="title_text">Inscrever-se</h2>    
                    {error && <p className="error">{error}</p>}
                    <div className="input">
                        <img src="/user.svg" alt="Nome Icone" id="user_icon"/>
                        <input type='text' placeholder="Nome"
                            value={name}
                            onChange={evento => setName(evento.target.value)}
                        />
                    </div>
                    <div className="input">
                        <img src="/mail.svg" alt="Login Icone" />
                        <input type='text' placeholder="Login"
                            value={email}
                            onChange={evento => setEmail(evento.target.value)}
                        />
                    </div>
                    <div className="input">
                        <img src="/lock.svg" alt="Senha Icone" />
                        <input type='password' placeholder="Senha"
                            value={password}
                            onChange={evento => setPassword(evento.target.value)}
                        />
                    </div>
                    <button onClick={doCadastro} disabled={loading}>{loading ? '...Carregando': 'Cadastrar'}</button>
                    <div className="div_link">
                        <span className="link_button" onClick={backToLogin}>Voltar</span>
                    </div>
                </div>
            </div>
            <Modal
                show={showModal}
                className="container-modal">
                <Modal.Body>
                    <div className="success_modal">
                        <p className="normal_text">{mensagemModal}</p>
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <div className="button col-12">
                        <span onClick={backToLogin}>voltar</span>
                    </div>
                </Modal.Footer>
            </Modal>
        </>
    );
}