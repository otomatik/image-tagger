import styled from 'styled-components'
import { Zone } from './index'

export const Wrapper = styled.main``

export const Tagger = styled.div`
  position: relative;
  user-select: none;
  margin: 16px auto;
`

export const Remove = styled.span`
  position: absolute;
  top: -12px;
  right: -12px;
  height: 24px;
  width: 24px;
  display: none;
  align-items: center;
  justify-content: center;
  background: black;
  color: white;
  font-size: 12px;
  font-weight: bold;
  border-radius: 50%;
  user-select: none;
  &:before {
    content: 'X';
  }
  &:hover {
    color: lightgrey;
  }
`

export const Tag = styled.div<{ zone: Zone }>`
  position: absolute;
  border: solid black 2px;
  cursor: pointer;
  top: ${({ zone }) => zone.top}px;
  left: ${({ zone }) => zone.left}px;
  width: ${({ zone }) => zone.width}px;
  height: ${({ zone }) => zone.height}px;
  &:hover ${Remove} {
    display: flex;
  }
`
