export class GithubUser {
  static search(username) {
    const endpoint = `https://api.github.com/users/${username}`

    return fetch(endpoint)
    .then(data => data.json())
    .then(({login, name, public_repos, followers }) => ({
      login,
      name,
      public_repos,
      followers,
    }))
  }
}


export class Favorites {
  constructor(root) {
      this.root = document.querySelector(root)
      this.load()
  }

  load() {
    this.entries = JSON.parse(
      localStorage.getItem('@github-favorites')) || []
  }

  async add(username) {
    try {
    const user = await GithubUser.search(username)

    if(user.login === undefined) {
      throw new Error('Usuario nao encontrado!')
    } this.entries = [user, ...this.entries]
      this.updates()
       } catch(error){
          alert(error.message)
       }
  
  }

  delete(user) {
    const filteredEntries = this.entries.filter(
      entry => entry.login !== user.login)

      this.entries =filteredEntries
      this.update()
  }
}

export class FavoritesView extends Favorites {

  constructor(root) {
      super(root)
      this.tbody = document.querySelector('table tbody')
      this.update()
      this.onadd()
  }

  onadd() {
    const addButton = this.root.querySelector('#button1')
    addButton.onclick = () => {
      const {value} = this.root.querySelector('#input-search')
      this.add(value)
    }
 }

  update() {
      this.removeAllTr()
      
      this.entries.forEach(user => {
          const row = this.createRow()
          row.querySelector('.user img').src = `https://github.com/${user.login}.png`
          row.querySelector('.user img').alt = `Imagem de ${user.name}`
          row.querySelector('.user p').textContent = user.name
          row.querySelector('.user span').textContent = user.login
          row.querySelector('.repositories').textContent = user.public_repos
          row.querySelector('.followers').textContent = user.followers
          row.querySelector('.remove').onclick = () => {
            const isOK = confirm('tem certeza?')
            if(isOK) {
              this.delete(user)
            }
          }

          this.tbody.append(row)
      })
    
  }

  createRow() {
      const tr = document.createElement('tr')
      tr.innerHTML = `
      <td class="user">
         <img src="https://github.com/maykbrito.png" alt="Imagem de maykbrito">
         <a href="https://github.com/maykbrito" target="_blank">
           <p>Mayk Brito</p>
           <span>maykbrito</span>
         </a>
       </td>
       <td class="repositories">
         76
       </td>
       <td class="followers">
         9589
       </td>
       <td>
         <button class="remove">&times;</button>
       </td>
      `
      return tr
      }

  removeAllTr() {
      this.tbody.querySelectorAll('tr').forEach((tr) => {
          tr.remove()
      });
  }
}