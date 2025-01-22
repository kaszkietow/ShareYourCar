# ShareYourCar 🏝️

### Jak uruchomić aplikację w Pycharm?

1. Sklonuj repozytorium z github:

```bash
git clone https://github.com/kaszkietow/ShareYourCar.git
```

2. Przejdź do folderu głównego projektu:

```bash
cd ShareYourCar
```

3. Przejdź do strony backendu:

```bash
cd backend
```
4. Upewnij się, że masz venv w folderze backend jeśli nie to musisz utworzyć.

5. Zainstaluj wymagane repozytoria:

-   Na macOS i Linux:

```bash
pip3 install -r requirements.txt
```

-   Na Windows:

```bash
pip install -r requirements.txt
```

6. Przejdź do strony frontendu:

```bash
cd ../frontend
```

7. Zainstaluj potrzebne repozytoria:

```bash
npm install
```

8. Zbuduj frontend aplikacji:

```bash
npm run build
```

9. Przejdź do strony backendu:

```bash
cd ../backend
```

10. Uruchom aplikację Flask:

```bash
flask run --reload
```

11. Otwórz przeglądarkę i wpisz `http://localhost:3000/` żeby zobaczyć aplikację.
Backend działa na URL `http://localhost:5000`, warto skorzystać ze swaggera, który znajduje się na URL `http://localhost:5000/swagger`.

---

### Opis projektu

ShareYourCar to aplikacja do zarządzania wynajmem samochodów, w której można tworzyć konta użytkowników, przeglądać oferty samochodów, dokonywać rezerwacji(niedopracowane) oraz zarządzać płatnościami(wkrótce). Projekt korzysta z Flaska jako backendu, SQLite jako bazy danych oraz Reacta na frontendzie.

#### Główne funkcjonalności backendu:

1. **Logowanie i wylogowywanie użytkowników**:
   - Endpoint logowania (`/login`) umożliwia autoryzację użytkownika po nazwie i haśle.
   - Endpoint wylogowania (`/logout`) zamyka sesję użytkownika.

2. **Wyświetlanie samochodów**:
   - Endpoint `/cars` zwraca listę samochodów dostępną wyłącznie dla zalogowanych użytkowników.

3. **Rezerwacje i zarządzanie nimi**:
   - Użytkownicy mogą dokonywać rezerwacji samochodów oraz przeglądać historię swoich rezerwacji.

4. **Płatności**:
   - System umożliwia zarządzanie płatnościami powiązanymi z rezerwacjami (np. sprawdzanie statusu płatności).

#### Technologie:
- **Backend**: Flask (Python) + SQLite
- **Frontend**: React.js
- **Autoryzacja**: Flask-Login
- **API**: Swagger dla dokumentacji endpointów

### Struktura modeli bazy danych

#### User
```python
class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(50), unique=True, nullable=False)
    password = db.Column(db.String(50), nullable=False)
    img_url = db.Column(db.String(200), nullable=False)
    gender = db.Column(db.String(10), nullable=False)
    cars = db.relationship('Car', backref='owner', lazy=True)
    reservations = db.relationship('Reservation', backref='user', lazy=True)
```

#### Car
```python
class Car(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    model = db.Column(db.String(80), nullable=False)
    description = db.Column(db.String(200), nullable=False)
    available = db.Column(db.String(10), nullable=False)
    img_url = db.Column(db.String(200), nullable=False)
    price = db.Column(db.Integer, nullable=False)
    owner_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    reservations = db.relationship('Reservation', backref='car', lazy=True)
```

#### Reservation
```python
class Reservation(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    car_id = db.Column(db.Integer, db.ForeignKey('car.id'), nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    reservation_date = db.Column(db.DateTime, nullable=False)
    return_date = db.Column(db.DateTime, nullable=False)
    payment = db.relationship('Payment', backref='reservation', lazy=True)
```

#### Payment
```python
class Payment(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    reservation_id = db.Column(db.Integer, db.ForeignKey('reservation.id'), nullable=False)
    amount = db.Column(db.Integer, nullable=False)
    status = db.Column(db.String(20), nullable=False)
```

### Konfiguracja Flask-Login

1. Dodanie logowania i wylogowania do API:

```python
@app.route('/login', methods=['POST'])
def login():
    data = request.json
    username = data.get('username')
    password = data.get('password')
    user = User.query.filter_by(username=username).first()

    if user and user.password == password: 
        login_user(user)
        return jsonify({"message": "Logged in successfully", "user": user.to_json_user()}), 200
    return jsonify({"message": "Invalid username or password"}), 401

@app.route('/logout', methods=['POST'])
@login_required
def logout():
    logout_user()
    return jsonify({"message": "Logged out successfully"}), 200
```

2. Endpoint wyświetlania samochodów:

```python
@app.route('/cars', methods=['GET'])
@login_required
def get_cars():
    cars = Car.query.all()
    return jsonify([car.to_json_car_with_owner() for car in cars]), 200
```

### Dalsze kroki rozwoju
- Implementacja hashowania haseł przy użyciu biblioteki **bcrypt**.
- Rozszerzenie endpointów o filtrowanie samochodów (np. tylko dostępne).
- Dodanie testów jednostkowych dla API.
- Ulepszenie frontendu (np. obsługa wiadomości błędów z backendu).
- obsługa płatności za dokonane transakcje.
- ulepszenie funkcjonalności rezerwacji.

---

