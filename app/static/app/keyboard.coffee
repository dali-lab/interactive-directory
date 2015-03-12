$ ->
  $write = $('#search-text')
  shift = false
  capslock = false
  $('#keyboard li').click ->
    $this = $(this)
    character = $this.html()

    # If it's a lowercase letter, nothing happens to this variable
    # Shift keys
    if $this.hasClass('left-shift') or $this.hasClass('right-shift')
      $('.letter').toggleClass 'uppercase'
      $('.symbol span').toggle()
      shift = if shift == true then false else true
      capslock = false
      return true

    # Caps lock
    if $this.hasClass('capslock')
      $('.letter').toggleClass 'uppercase'
      capslock = true
      return true

    # Delete
    if $this.hasClass('delete')
      html = $write.val()
      $write.val html.substr(0, html.length - 1)
      return true

    # Special characters
    if $this.hasClass('symbol')
      character = $('span:visible', $this).html()
    if $this.hasClass('space')
      character = ' '
    if $this.hasClass('tab')
      character = '\t'
    if $this.hasClass('return')
      character = '\n'

    # Uppercase letter
    if $this.hasClass('uppercase')
      character = character.toUpperCase()

    # Remove shift once a key is clicked.
    if shift == true
      $('.symbol span').toggle()
      if capslock == false
        $('.letter').toggleClass 'uppercase'
      shift = false

    # Add the character
    $write.val $write.val() + character
    return
  return
