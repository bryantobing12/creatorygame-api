import express from 'express'
import ApiError from '../errors/ApiError'

import CharacterModel from '../models/character.model'

const router = express.Router()

// Get All character
router.get('/', async (req, res, next) => {
  const characters = await CharacterModel.find()
  res.send(characters || [])
})

// Get One Character
router.get('/:slug', async (req, res, next) => {
  const slug = req.body.slug

  if (!slug) {
    return next(new ApiError(400, 'Slug required'))
  }

  const character = await CharacterModel.findOne({ slug })

  if (!character) {
    return next(new ApiError(404, 'Character not found'))
  }
  res.send(character)
})

// Create Character
router.post('/', async (req, res) => {
  const character = new CharacterModel(req.body)

  await character.save()
  res.status(201).send('Character Created')
})

// Delete Character
router.delete('/:slug', async (req, res, next) => {
  const slug = req.params.slug

  if (!slug) {
    return next(new ApiError(400, 'Slug required'))
  }

  await CharacterModel.deleteOne({ slug })
  res.status(200).send('Character Deleted')
})

export default router
