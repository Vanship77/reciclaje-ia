# backend/crear_usuarios.py
import psycopg2
import hashlib

DB_CONFIG = {
    'host': 'localhost',
    'database': 'reciclaje_db',
    'user': 'postgres',
    'password': 'vanship77',  # Cambia por tu contraseña
    'port': '5432'
}

def hash_password(pwd):
    return hashlib.sha256(pwd.encode()).hexdigest()

def crear_usuarios():
    try:
        conn = psycopg2.connect(**DB_CONFIG)
        cursor = conn.cursor()
        
        # Borrar todos los usuarios
        cursor.execute("DELETE FROM usuarios")
        cursor.execute("ALTER SEQUENCE usuarios_id_seq RESTART WITH 1")
        
        usuarios = [
            ('1234567890', 'florentino@administrador.com', 'Florentino', hash_password('admin123'), 'admin', 1500),
            ('0987654321', 'belen@usuario.com', 'Belén', hash_password('belen123'), 'usuario', 850),
            ('1111111111', 'carlos@usuario.com', 'Carlos', hash_password('carlos123'), 'usuario', 320),
            ('2222222222', 'laura@usuario.com', 'Laura', hash_password('laura123'), 'usuario', 670),
            ('3333333333', 'ana@usuario.com', 'Ana', hash_password('ana123'), 'usuario', 920),
            ('4444444444', 'javier@usuario.com', 'Javier', hash_password('javier123'), 'usuario', 440),
            ('5555555555', 'gomez@usuario.com', 'Familia Gómez', hash_password('gomez123'), 'usuario', 1200)
        ]
        
        for u in usuarios:
            cursor.execute("""
                INSERT INTO usuarios (cedula, email, nombre, password, rol, puntaje_total) 
                VALUES (%s, %s, %s, %s, %s, %s)
            """, u)
            print(f"✅ Usuario: {u[1]} / Contraseña: {u[3][:8]}...")
        
        conn.commit()
        conn.close()
        
        print("=" * 60)
        print("✅ USUARIOS CREADOS EXITOSAMENTE")
        print("=" * 60)
        print("\n📋 CREDENCIALES:")
        print("   Admin:   florentino@administrador.com / admin123")
        print("   Usuario: belen@usuario.com / belen123")
        print("   Usuario: carlos@usuario.com / carlos123")
        print("   Usuario: laura@usuario.com / laura123")
        print("   Usuario: ana@usuario.com / ana123")
        print("   Usuario: javier@usuario.com / javier123")
        print("   Usuario: gomez@usuario.com / gomez123")
        
    except Exception as e:
        print(f"❌ Error: {e}")

if __name__ == "__main__":
    crear_usuarios()