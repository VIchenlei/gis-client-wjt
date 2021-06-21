function setUserCredential (nodeName, nodePwd, nameLabel, pwdLabel) {
  if (navigator.credentials) {
    navigator.credentials.get({ password: true }).then((cred) => {
      if (cred && cred.type === 'password') {
        nodeName.value = cred.id
        nodePwd.value = cred.password
        if (nodeName.value) {
          nameLabel.classList.add('mdc-text-field__label--float-above')
          nameLabel.innerText = '帐号:'
        }
        if (nodePwd.value) {
          pwdLabel.classList.add('mdc-text-field__label--float-above')
          pwdLabel.innerText = '密码:'
        }
      } else {
        console.warn('Get credential ERROR. ', cred)
      }
    })
  } else {
    console.warn('Handle sign-in the way you did before.')
  }
}

function saveCredential (name, pwd) {
  if (navigator.credentials) {
    let cred = new window.PasswordCredential({
      id: name,
      password: pwd,
      name: name
    })

    navigator.credentials.store(cred).then(() => {
      console.log('Save credential OK.', cred)
      return true
    }).catch(() => {
      console.warn('Save credential FAILED.')
    })
  }
}

const MODIFYPWDDEFS = [
  {
    sign: 'oldpwd',
    labelText: '当前密码：',
    placeholder: '请输入您当前的密码'
  },
  {
    sign: 'newpwd',
    labelText: '新密码：',
    placeholder: '请输入新密码'
  },
  {
    sign: 'newpwdRpt',
    labelText: '重复新密码：',
    placeholder: '请重复输入新密码'
  }
]

const USERLIST = [
  {icon: 'changebg', name: '一键换肤'},
  {icon: 'metadata', name: '更新部分配置'},
  {icon: 'allmetadata', name: '更新全部配置'},
  {icon: 'lock', name: '修改密码'},
  {icon: 'poweroff', name: '退出系统'}
]

export { setUserCredential, saveCredential, MODIFYPWDDEFS, USERLIST }
