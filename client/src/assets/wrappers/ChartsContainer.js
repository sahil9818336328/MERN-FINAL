import styled from 'styled-components'

const Wrapper = styled.section`
  margin-top: 4rem;
  text-align: center;
  button {
    background: transparent;
    border-color: transparent;
    text-transform: capitalize;
    color: var(--white);
    background-color: var(--primary-500);
    padding: 0.3rem 1rem;
    border-radius: var(--border-radius);
    font-size: 1.25rem;
    cursor: pointer;
  }
  h4 {
    text-align: center;
    margin-bottom: 1.5rem;
  }
`

export default Wrapper
