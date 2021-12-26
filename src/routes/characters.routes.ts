import express from 'express'
import ApiError from '../errors/ApiError'

import CharacterModel from '../models/character.model'
import catchAsync from '../utils/catchAsync'

const router = express.Router()

// Get All character
router.get(
  '/',
  catchAsync(async (req, res, next) => {
    const category = (req.query.category || '') as string
    const query = (req.query.query || '') as string

    if (!category && query) {
      const characters = await CharacterModel.find({
        $text: {
          $search: query,
        },
      })

      res.send(characters || [])
    } else if (category && !query) {
      const characters = await CharacterModel.find({
        categories: { $in: [category] },
      })

      res.send(characters || [])
    } else if (category && query) {
      const characters = await CharacterModel.find({
        categories: { $in: [category] },
        $text: {
          $search: query,
        },
      })
      res.send(characters || [])
    } else {
      const characters = await CharacterModel.find()

      res.send(characters || [])
    }
  })
)

// Get One Character
router.get(
  '/:slug',
  catchAsync(async (req, res, next) => {
    const slug = req.params.slug

    if (!slug) {
      return next(new ApiError(400, 'Slug required'))
    }

    const character = await CharacterModel.findOne({ slug })

    if (!character) {
      return next(new ApiError(404, 'Character not found'))
    }
    res.send(character)
  })
)

// Create Character
router.post(
  '/',
  catchAsync(async (req, res) => {
    const character = new CharacterModel(req.body)

    await character.save()
    res.status(201).send('Character Created')
  })
)

// Delete Character
router.delete(
  '/:slug',
  catchAsync(async (req, res, next) => {
    const slug = req.params.slug

    if (!slug) {
      return next(new ApiError(400, 'Slug required'))
    }

    await CharacterModel.deleteOne({ slug })
    res.status(200).send('Character Deleted')
  })
)

export default router
