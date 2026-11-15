import { Service } from "@angular/core";
import { IUsuario } from "../interfaces/iusuario.interface";

@Service()
export class UsuarioService {
    private usuarios: IUsuario[];
    private siguienteId: number;

    constructor() {
        this.usuarios = [];
        this.siguienteId = 1;
    }

    registrarUsuario(usuario: IUsuario): boolean {
        const duplicado = this.usuarios.find(function (usuarioGuardado) {
            return usuarioGuardado.email.toLowerCase() === usuario.email.toLowerCase();
        });

        if (duplicado !== undefined) {
            return false;
        }

        usuario.id = this.siguienteId;
        this.siguienteId++;
        this.usuarios.push(usuario);
        return true;
    }

    getAllUsuarios(): IUsuario[] {
        return this.usuarios;
    }
}
