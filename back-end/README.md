#  Guida di Configurazione: Git & SonarQube in Locale con Docker

Questo documento contiene tutte le istruzioni necessarie per avviare un server locale SonarQube tramite Docker ed eseguire l'analisi del codice in ambiente Windows (PowerShell).

---

## Credenziali SonarQube Locali
L'istanza locale di SonarQube risponde ai seguenti dati di accesso:
* **URL:** [http://localhost:9000]
* **Username:** `admin`
* **Password:** `Emanuele99!!!@`

---

##  Avvio docker
docker-compose up -d

## Lancio comando sonarqube
Dopo aver completato l'avvio di docker e fatto il login sul portale di sonarqube lanciare il seguente comando per iniziare l'analisi :
`docker run --rm -v "${PWD}:/usr/src" --% sonarsource/sonar-scanner-cli -Dsonar.host.url="http://host.docker.internal:9000" -Dsonar.token="sqp_bf8d2722cea9b4d0064d8e5ff069101df757dd4d"`

## Visualizzazione report

Una volta terminato il comando recarsi su http://localhost:9000 inserire le credenziali sopra citate e visualizzare il report nella pagina

## Termine attività 
Visto il report lanciare il comando `docker-compose down` per terminare il server docker
