package hr.fer.styletrack.backend.controllers;

import hr.fer.styletrack.backend.entities.Tag;
import hr.fer.styletrack.backend.repos.ITagRepository;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@AllArgsConstructor
@RequestMapping("/api/tags")
public class TagsController {
    private final ITagRepository tagRepository;

    @GetMapping("/search")
    public ResponseEntity<List<String>> searchTags(@RequestParam String query) {
        List<String> tags = tagRepository.findTagsByTagNameStartingWith(query)
                .stream()
                .map(Tag::getTagName)
                .toList();

        return ResponseEntity.ok(tags);
    }

    @PostMapping("/create/{tagName}")
    public ResponseEntity<Tag> createTag(@PathVariable String tagName) {
        if (tagRepository.getTagByTagName(tagName).isPresent()) {
            return ResponseEntity.status(HttpStatus.ALREADY_REPORTED).build();
        }

        Tag tag = new Tag();
        tag.setTagName(tagName);

        tag = tagRepository.save(tag);

        return ResponseEntity.status(HttpStatus.CREATED).body(tag);
    }
}
