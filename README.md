# ddu-filter-converter_file_info

converter for file info

## Required
### denops.vim
https://github.com/vim-denops/denops.vim

### ddu.vim
https://github.com/Shougo/ddu.vim

## Configuration
```vim
	call ddu#start(#{
		\	sources: [#{
		\		name: 'file',
		\		options: #{
		\			converters: ['converter_file_info']
		\		}
		\	}],
		\})
```

## Screenshot
screenshot with my setting

this plugin shows permissions`-rw-r-...`, size `58`, and so on.

![image](https://github.com/kamecha/ddu-filter-converter_file_info/assets/50443168/7e7f6525-e8cf-4c06-b29f-3f8395aa0f62)
